<template>
  <div>
    <anime-card v-for="(a, key) in animes" v-bind:key="key" mostrarCapitulo="true" :data="a"/>
  </div>
</template>
<script>
import AnimeCard from "../components/AnimeCard.vue";
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import store from '../store'
export default {
  components:{
    AnimeCard
  },
  props: ['getCategoriaId'],
  data(){
    return {
      collection: 'viendo',
      animes: []
    }
  },
  methods:{
    getAnimes: async function(){
      await firebase.firestore().collection('viendo').where('email', '==', firebase.auth().currentUser.email).orderBy('actualizado_en','desc').get().then((snapshot) => {
        this.animes = [];
        snapshot.forEach((doc) => {
          let data = doc.data();
          Object.assign(data, { id: doc.id})
          Object.assign(data, { visible: false })
          Object.assign(data, { col: 'viendo' })
          this.animes.push(data);
        })
        store.commit('setAnimes',{
          id: 0,
          animes: this.animes
        })
      })
    }
  },
  mounted(){
    firebase.auth().onAuthStateChanged(() => {
      if(store.state.animes[0].length == 0){
        this.getAnimes();
      }
      else{
        this.animes = store.state.animes[0]
      }
      this.$emit('updateUser');
    })
  },
}
</script>
