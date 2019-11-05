<template>
<div class="d-inline-block">
  <v-card
  max-width="225px"
  class="ma-2"
  >
    <v-img :src="data.imagen" width="225px"/>
    <v-card-title class="text-center" v-if="titulo.length < 50">{{titulo}}</v-card-title>
    <v-card-title class="text-center" v-else>{{titulo.substring(0,50) + '...'}}</v-card-title>
    <v-card-text v-if="data.capitulo">Capítulo: {{data.capitulo}}</v-card-text>
    <v-card-actions>
      <v-btn class="mr-0" v-if="data.capitulo" @click="capitulo(false)" icon><v-icon>mdi-arrow-left-drop-circle</v-icon></v-btn>
      <v-btn class="ml-0" v-if="data.capitulo" @click="capitulo(true)" icon><v-icon>mdi-arrow-right-drop-circle</v-icon></v-btn>
      <v-spacer/>
      <v-btn class="mr-0" icon @click="edit"><v-icon>mdi-pencil</v-icon></v-btn>
      <v-btn class="ml-0" icon @click.stop="dialog = true"><v-icon>mdi-delete</v-icon></v-btn>
      <v-menu offset-y>
        <template v-slot:activator="{on}">
          <v-btn icon v-on="on"><v-icon>mdi-more</v-icon></v-btn>
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
        <v-list-item @click="move('odiados')">
          Mover a odiados
        </v-list-item>
        <v-list-item @click="move('pendientes')">
          Mover a pendientes
        </v-list-item>
      </v-list>
      </v-menu>
    </v-card-actions>
  </v-card>
   <v-dialog
      v-model="dialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline truncate">¿Quieres borrar este anime?</v-card-title>

        <v-card-text>
          Cuando borres {{titulo}} no vas a poder recuperar ninguna de su información.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

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
import firebase from 'firebase/app'
import 'firebase/firestore'
export default {
  props: ['data'],
  data(){
    return{
      dialog: false
    }
  },
  methods: {
    remove: async function(){
      this.dialog = false;
      await firebase.firestore().collection(this.col).doc(this.data.id).delete();
    },
    move: async function(where) {
      let timestamp = firebase.firestore.FieldValue.serverTimestamp();
      await firebase.firestore().collection(where).doc().set({
        nombre_jp: this.data.nombre_jp,
        nombre_en: this.data.nombre_en,
        imagen: this.data.imagen,
        actualizado_en: timestamp
      });
  
      await firebase.firestore().collection(this.col).doc(this.data.id).delete();
    },
    capitulo: async function(sumar){
      let new_data = {
        nombre_jp: this.data.nombre_jp,
        nombre_en: this.data.nombre_en,
        imagen: this.data.imagen,
        actualizado_en: this.data.actualizado_en
      }
      if(sumar){
        Object.assign(new_data, {capitulo: this.data.capitulo+1})
      }
      else{
        Object.assign(new_data, {capitulo: this.data.capitulo-1})
      }
      await firebase.firestore().collection(this.col).doc(this.data.id).set(new_data);
    },
    edit: async function(){
      let commit = this.data;
      Object.assign(commit, {col: this.col});
      this.$store.commit('iniciarEdicion', commit);
    }
  },
  computed: {
    col: function(){
      if(this.$route.params.collection){
        return this.$route.params.collection;
      }
      else{
        return 'viendo';
      }
    },
    titulo: function(){
      if(this.$store.state.titulo){
        return this.data.nombre_en;
      }
      else{
        return this.data.nombre_jp;
      }
    }
  }
}
</script>
