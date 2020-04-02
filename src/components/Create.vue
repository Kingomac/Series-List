<template>
  <v-form>
    <v-text-field
      clearable
      v-model="nombre_jp"
      placeholder="Nombre japonés"
    />
    <v-text-field
      clearable
      v-model="nombre_en"
      placeholder="Nombre inglés"
    />
    <v-text-field
      clearable
      v-model="imagen"
      placeholder="Link de la imagen"
    />
    <v-btn
      block
      :loading="fileUploading"
      @click="uploadImg"
    >
      Subir imagen
    </v-btn>
    <v-file-input
      @change="setFile"
      :value="file"
    />
    <v-btn
      block
      @click="add"
    >
      Añadir
    </v-btn>
  </v-form>
</template>
<script>
import firebase from 'firebase/app';
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/auth'

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
  props: {
    getAnimeId:{
      type: Function,
      default: null
    }
  },
  methods: {
    add: async function(){
      if(this.nombre_jp == '' || this.nombre_jp == null || this.nombre_en == null || this.nombre_en == '') return null;
      let categ;
      if(this.$route.params.collection){
        categ = this.$route.params.collection;
      }
      else{
        categ = 'viendo';
      }
      let timestamp = firebase.firestore.FieldValue.serverTimestamp();
      let data = {
        nombre_jp: this.nombre_jp,
        nombre_en: this.nombre_en,
        imagen: this.imagen,
        email: firebase.auth().currentUser.email,
        capitulo: 0,
        actualizado_en: timestamp
      }
      this.$store.commit('unshiftAnime', {
        id: this.getAnimeId,
        anime: data
      })
      await firebase.firestore().collection(categ).doc().set(data).then(async () => {
        await this.clean();
      }).catch((e)=>{
        console.log(e);
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
      let name = firebase.functions().httpsCallable('generateUniqueId')
      name().then((res) => {
        firebase.storage().ref().child(`/anime-covers/${res.data}.${e.name.split('.').pop()}`).put(e).then((e) => {
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
        })
    },
    setFile: async function(e){
      this.file = e;
    }
  }
}
</script>