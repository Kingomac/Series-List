<template>
  <v-form>
    <v-text-field
      clearable
      v-model="anime.nombre_jp"
      placeholder="Nombre japonés"
    />
    <v-text-field
      clearable
      v-model="anime.nombre_en"
      placeholder="Nombre inglés"
    />
    <v-text-field
      clearable
      v-model="anime.imagen"
      placeholder="Link de la imagen"
    />
    <v-btn block class="mb-1" @click="confirmar">
      Editar
    </v-btn>
    <v-btn block @click="cancelar">
      Cancelar
    </v-btn>
  </v-form>
</template>
<script>
import firebase from 'firebase/app'
import 'firebase/firestore'
export default {
  computed: {
    anime: function () {
      return this.$store.state.editar.anime
    }
  },
  methods: {
    confirmar: async function () {
      if (
        this.anime.nombre_jp == null ||
          this.anime.nombre_jp === '' ||
          this.anime.nombre_en == null ||
          this.anime.nombre_en === ''
      ) {
        return null
      }
      const timestamp = firebase.firestore.FieldValue.serverTimestamp()
      const newdata = Object.assign({}, this.anime)
      delete newdata.id
      newdata.actualizado_en = timestamp
      await firebase
        .firestore()
        .collection(this.$route.params.collection)
        .doc(this.anime.id)
        .set(newdata)
        .then(() => this.$store.commit('finalizarEdicion'))
    },
    cancelar: function () {
      this.$store.commit('finalizarEdicion')
    }
  }
}
</script>
