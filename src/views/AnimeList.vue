<template>
  <div>
    <anime-card v-on:hide="remove(key)" v-for="(a, key) in animes" v-bind:key="key" :data="a"/>
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
  props: ['getCategoriaId', 'getAnimeId'],
  data(){
    return {
      animes: [],
      animeId: 0
    }
  },
  methods:{
    remove: async function(index){
      store.state.animes[this.animeId].splice(index,1);
    },
    getStartAnimes: async function(){
      await firebase.firestore().collection(this.$route.params.collection).orderBy('actualizado_en', 'desc').where('email', '==', firebase.auth().currentUser.email).limit(12).get().then((snapshot) => {
        this.animes = [];
        snapshot.forEach((doc) => { 
          let data = doc.data();
          Object.assign(data, {id: doc.id});
          Object.assign(data, {col: this.$route.params.collection})
          if(this.animeId !== 0){
            delete data.capitulo;
          }
          this.animes.push(data);
        })
        store.commit('setAnimes',{
          id: this.animeId,
          animes: this.animes
        })
      })
    },
    addAnimes: async function(){
      await firebase.firestore().collection(this.$route.params.collection).orderBy('actualizado_en','desc').where('email', '==', firebase.auth().currentUser.email).startAfter(this.animes[this.animes.length-1].actualizado_en).limit(6).get().then((snapshot) => {
        snapshot.forEach((doc) => { 
          let data = doc.data();
          Object.assign(data, {id: doc.id});
          Object.assign(data, {col: this.$route.params.collection})
          this.animes.push(data);
        })
        store.commit('setAnimes',{
          id: this.animeId,
          animes: this.animes
        })
      })
    },
    checkScroll: function(){
      window.addEventListener('scroll', () => {
        if(window.innerHeight + window.scrollY >= document.body.offsetHeight) this.addAnimes();
      })
    },
    checkUserAndGet: function(){
      if(firebase.auth().currentUser) this.getStartAnimes();
    },
    updateRoute: function(){
      this.animeId = this.getAnimeId;
      if(store.state.animes[this.animeId].length > 0){
        this.animes = store.state.animes[this.animeId]
      }
      else{
        this.getStartAnimes();
      }
    }
  },
  mounted(){
    if(this.getAnimeId == -1){
        this.$router.push('/viendo')
      }
    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        this.$emit('updateUser');
        this.updateRoute();
      }
    });
    this.checkScroll();
  },
  watch:{
    '$route': function(){
      this.updateRoute();
    }
  }
}
</script>
