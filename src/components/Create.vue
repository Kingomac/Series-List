<template>
  <v-form>
    <v-text-field clearable v-model="nombre_jp" placeholder="Nombre japonés"/>
    <v-text-field clearable v-model="nombre_en" placeholder="Nombre inglés"/>
    <v-text-field clearable v-model="imagen" placeholder="Link de la imagen"/>
    <v-btn block :loading="fileUploading" @click="uploadImg">Subir imagen</v-btn>
    <v-file-input @change="setFile" :value="file"></v-file-input>
    <v-btn block @click="add">Añadir</v-btn>
  </v-form>
</template>
<script>
import firebase from 'firebase/app';
import 'firebase/firestore'
import 'firebase/storage'

export default {
  data(){
    return{
      nombre_jp: '',
      nombre_en: '',
      imagen: '',
      file: [],
      fileUploading: false
    }
  },
  methods: {
    add: async function(){
      if(this.nombre_jp == '' || this.nombre_jp == null || this.nombre_en == null || this.nombre_en == '') return null;
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
    },
    uploadImg: async function(){
      this.fileUploading = true;
      await this.fileChange(this.file)
    },
    fileChange: async function(e){
      firebase.storage().ref().child(`/anime-covers/${await this.generateUniqueId()}.${e.name.split('.').pop()}`).put(e).then((e) => {
        e.ref.getDownloadURL().then((e) => {
          this.imagen = e;
        }).catch((e) => {
          this.imagen = e;
        });
        this.fileUploading = false;
      }).catch((e) => {
        console.log(e);
        this.fileUploading = false;
      })
    },
    setFile: async function(e){
      this.file = e;
    },
    generateUniqueId: async function(){
      return Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
    }
  }
}
</script>
