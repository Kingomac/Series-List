<template>
  <v-container>
    <v-form>
      <v-text-field v-model="nombre_jp" placeholder="Nombre japonés"/>
      <v-text-field v-model="nombre_en" placeholder="Nombre inglés"/>
      <v-text-field v-model="imagen" placeholder="Link de la imagen"/>
      <v-btn block @click="add">Añadir</v-btn>
    </v-form>
  </v-container>
</template>
<script>
import firebase from 'firebase/app';
import 'firebase/firestore'
export default {
  props: ['showSnackbar'],
  data(){
    return{
      nombre_jp: null,
      nombre_en: null,
      imagen: null
    }
  },
  methods: {
    add: async function(){
      let col;
      if(this.$route.params.collection){
        col = this.$route.params.collection;
      }
      else{
        col = 'viendo';
      }
      let timestamp = firebase.firestore.FieldValue.serverTimestamp();
      let data = {
        nombre_jp: this.nombre_jp,
        nombre_en: this.nombre_en,
        imagen: this.imagen,
        capitulo: 1,
        actualizado_en: timestamp
      }
      await firebase.firestore().collection(col).doc().set(data).then(() => {
        this.showSnackbar();
      }).catch(()=>{
        this.error.mostrar = true;
      })
      await this.clean();
    },
    clean: async function(){
      this.nombre_jp = null;
      this.nombre_en = null;
      this.imagen = null;
    }
  }
}
</script>
