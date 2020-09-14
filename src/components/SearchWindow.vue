<template>
<v-fade-transition>
  <div v-if="termino !== null && termino.length > 5">
      <v-row>
      <div class="headline" style="width:100%;text-align:center">Búsqueda</div>
      </v-row>
      <v-divider />
      <v-row align="stretch" >
        <anime-card v-for="(a, key) in animes" v-bind:key="key" :data="a" :showChapter="false" />
      </v-row>
        <v-divider class="mb-3"/>
  </div>
   </v-fade-transition>
</template>

<script>
import store from '../store'
import AnimeCard from '../components/AnimeCard.vue'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
export default {
  name: 'SearchWindow',
  components: {
    AnimeCard
  },
  computed: {
    termino: function () {
      return store.state.busqueda
    }
  },
  data () {
    return {
      animes: []
    }
  },
  methods: {
    loadAnimes: async function () {
      this.animes = []
      const query = await firebase.firestore().collection(this.$route.params.collection).where('nombre_jp', '>=', this.termino).limit(6).get()
      query.docs.forEach((d) => {
        if (d.data().email === firebase.auth().currentUser.email) {
          const data = d.data()
          data.id = d.id
          this.animes.push(data)
        }
      })
    }
  },
  watch: {
    termino: function () {
      if (this.termino !== null) {
        if (this.termino.length > 5) this.loadAnimes()
      }
    }
  }
}
</script>
