<template>
  <div>
    <anime-card
      @hide="remove(key)"
      v-for="(a, key) in animes"
      :key="key"
      :show-chapter="showChapter"
      :data="a"
    />
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
  props: { 
    getCategoriaId:{
      type: Function,
      default: null
    },
    getAnimeId:{
      type: Number,
      default: null
    }
  },
  data(){
    return {
      animes: [],
      animeId: 0,
    }
  },
  computed: {
    showChapter: function(){
      if(this.getAnimeId == 0) return true;
      else return false;
    }
  },
  methods:{
    remove: async function(index){
      store.state.animes[this.animeId].splice(index,1);
    },
    getStartAnimes: async function(){
      store.commit('setLoadingAnimes', true)
      await firebase.firestore().collection(this.$route.params.collection).orderBy('actualizado_en', 'desc').where('email', '==', firebase.auth().currentUser.email).limit(12).get().then((snapshot) => {
        this.animes = [];
        this.processData(snapshot);
      }).then(() => store.commit('setLoadingAnimes', false))
    },
    processData: async function(snapshot){
      await snapshot.forEach((doc) => { 
          let data = doc.data();
          data['id'] = doc.id;
          this.animes.push(data);
        })
        await store.commit('setAnimes',{
          id: this.animeId,
          animes: this.animes
        })
    },
    addAnimes: async function(){
      store.commit('setLoadingAnimes', true)
      await firebase.firestore().collection(this.$route.params.collection).orderBy('actualizado_en','desc').where('email', '==', firebase.auth().currentUser.email).startAfter(this.animes[this.animes.length-1].actualizado_en).limit(6).get().then((snapshot) => {
        this.processData(snapshot)
      }).then(() => store.commit('setLoadingAnimes', false))
    },
    checkScroll: function(){
      window.addEventListener('scroll', () => {
        if(window.innerHeight + window.scrollY >= document.body.offsetHeight && !store.state.loadingAnimes) this.addAnimes();
      })
    },
    checkUserAndGet: function(){
      if(firebase.auth().currentUser) this.getStartAnimes();
    },
    updateRoute: function(){
      this.animeId = this.getAnimeId;
      if(store.state.animes[this.animeId].length > 0){
        this.animes = store.state.animes[this.animeId]
        if(this.animes.length < 12){
          this.addAnimes();
        }
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
