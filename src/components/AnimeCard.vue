<template>
  <div class="d-flex elevation-5 ma-2">
    <v-lazy transition="fade-transition">
      <v-card
        max-width="225px"
        height="100%"
        class="card-outter"
      >
        <v-img
          :src="data.imagen"
          width="225px"
        />
        <v-card-title
          class="text-center"
          v-if="titulo.length < 50"
        >
          {{ titulo }}
        </v-card-title>
        <v-card-title
          class="text-center"
          v-else
        >
          {{ titulo.substring(0, 50) + "..." }}
        </v-card-title>
        <v-card-text
          class="card-chapter"
          v-if="showChapter"
        >
          Capítulo: {{ data.capitulo }}
        </v-card-text>
        <v-card-actions
          @mouseleave="saveChapter"
          class="card-actions"
        >
          <v-btn
            class="mr-0"
            v-if="showChapter && data.capitulo > 0"
            @click="data.capitulo--"
            icon
          >
            <v-icon>mdi-arrow-left-drop-circle</v-icon>
          </v-btn>
          <v-btn
            class="ml-0"
            v-if="showChapter"
            @click="data.capitulo++"
            icon
          >
            <v-icon>mdi-arrow-right-drop-circle</v-icon>
          </v-btn>
          <v-spacer />
          <v-btn
            class="mr-0"
            icon
            @click="edit"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            class="ml-0"
            icon
            @click.stop="dialog = true"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn
                icon
                v-on="on"
              >
                <v-icon>mdi-more</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="move('viendo')">
                Mover a viendo
              </v-list-item>
              <v-list-item @click="move('vistos')">
                Mover a vistos
              </v-list-item>
              <v-list-item @click="move('favoritos')">
                Mover a favoritos
              </v-list-item>
              <v-list-item @click="move('abandonados')">
                Mover a abandonados
              </v-list-item>
              <v-list-item @click="move('pendientes')">
                Mover a pendientes
              </v-list-item>
            </v-list>
          </v-menu>
        </v-card-actions>
      </v-card>
    </v-lazy>
    <v-dialog
      v-model="dialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline truncate">
          ¿Quieres borrar este anime?
        </v-card-title>

        <v-card-text>Cuando borres {{ titulo }} no vas a poder recuperar ninguna de su información.</v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn
            color="green darken-1"
            text
            @click="dialog = false"
          >
            No
          </v-btn>

          <v-btn
            color="green darken-1"
            text
            @click="remove"
          >
            Si
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import firebase from "firebase/app";
import "firebase/firestore";
export default {
  props: {
    data: {
      type: Object,
      default: null
    },
    showChapter: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dialog: false,
      initialChapter: undefined
    };
  },
  methods: {
    remove: async function () {
      this.dialog = false
      await firebase
        .firestore()
        .collection(this.col)
        .doc(this.data.id)
        .delete()
      this.$emit('hide')
    },
    move: function (where) {
      const timestamp = firebase.firestore.FieldValue.serverTimestamp()
      console.log('data:', this.data)
      const newdata = Object.assign({}, this.data)
      delete newdata.id
      newdata.actualizado_en = timestamp
      console.log('newdata', newdata)
      firebase
        .firestore()
        .collection(where)
        .doc(this.data.id)
        .set(newdata)
        .then(() => {
          firebase
            .firestore()
            .collection(this.col)
            .doc(this.data.id)
            .delete()
            .then(() => this.$emit('hide'))
          firebase
            .firestore()
            .collection(where)
            .doc(this.data.id)
            .get()
            .then(doc => {
              this.$store.commit('unshiftAnime', {
                id: this.getWhere(where),
                anime: Object.assign({}, this.data, {
                  actualizado_en: doc.data().actualizado_en
                })
              })
            })
        })
    },
    saveChapter: async function () {
      if (
        this.showChapter &&
        this.data.capitulo !== this.initialChapter &&
        this.$route.params.collection === 'viendo'
      ) {
        const newdata = Object.assign({}, this.data)
        delete newdata.id
        await firebase
          .firestore()
          .collection('viendo')
          .doc(this.data.id)
          .set(newdata)
        this.initialChapter = this.data.capitulo
      }
    },
    edit: async function () {
      this.$store.commit('iniciarEdicion', this.data)
    },
    getWhere: function (where) {
      switch (where) {
        case 'viendo':
          return 0
        case 'vistos':
          return 1
        case 'favoritos':
          return 2
        case 'abandonados':
          return 3
        case 'pendientes':
          return 4
        default:
          return -1
      }
    }
  },
  mounted () {
    this.initialChapter = this.data.capitulo
  },
  computed: {
    col: function () {
      if (this.$route.params.collection) {
        return this.$route.params.collection
      } else {
        return 'viendo'
      }
    },
    titulo: function () {
      if (this.$store.state.titulo) {
        return this.data.nombre_en
      } else {
        return this.data.nombre_jp
      }
    }
  }
};
</script>
<style>
.v-card {
  background-color: #2e3345 !important;
}
.v-card:hover {
  background-color: #31364a !important;
}
.card-outter {
  position: relative;
  padding-bottom: 70px;
}
.card-actions {
  position: absolute;
  bottom: 0;
}
.card-chapter {
  position: absolute;
  bottom: 40px;
}
</style>
