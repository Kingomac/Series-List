<template>
  <v-form>
    <v-text-field clearable v-model="nombre_jp" placeholder="Nombre japonés"/>
    <v-text-field clearable v-model="nombre_en" placeholder="Nombre inglés"/>
    <v-text-field clearable v-model="imagen" placeholder="Link de la imagen"/>
    <v-btn block @click="add">Añadir</v-btn>
  </v-form>
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
      await firebase.firestore().collection(col).doc().set(data).then(async () => {
        await this.clean();
      }).catch(()=>{
        
      })
    },
    clean: async function(){
      this.nombre_jp = "";
      this.nombre_en = "";
      this.imagen = "";
    }
  }
}
</script>
