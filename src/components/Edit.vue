<template>
  <v-form>
    <v-text-field clearable v-model="anime.nombre_jp" placeholder="Nombre japonés"/>
    <v-text-field clearable v-model="anime.nombre_en" placeholder="Nombre inglés"/>
    <v-text-field clearable v-model="anime.imagen" placeholder="Link de la imagen"/>
    <v-btn block class="mb-1" @click="confirmar">Editar</v-btn>
    <v-btn block @click="cancelar">Cancelar</v-btn>
  </v-form>
</template>
<script>
import firebase from 'firebase/app'
import 'firebase/firestore'
export default {
  computed: {
    anime: function(){
      return this.$store.state.editar.anime;
    }
  },
  methods: {
    confirmar: async function(){
      let timestamp = firebase.firestore.FieldValue.serverTimestamp();
      await firebase.firestore().collection(this.anime.col).doc(this.anime.id).set({
        nombre_jp: this.anime.nombre_jp,
        nombre_en: this.anime.nombre_en,
        imagen: this.anime.imagen,
        actualizado_en: timestamp
      }).then(() => {
        this.$store.commit('finalizarEdicion');
      })
    },
    cancelar: function(){
      this.$store.commit('finalizarEdicion');
    }
  }
}
</script>
