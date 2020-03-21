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
export default {
  components:{
    AnimeCard
  },
  props: ['getCategoriaId'],
  data(){
    return {
      animes: []
    }
  },
  computed:{
  },
  methods:{
    remove: async function(index){
      this.animes.splice(index,1);
    },
    getStartAnimes: async function(){
      await firebase.firestore().collection(this.$route.params.collection).orderBy('actualizado_en', 'desc').where('email', '==', firebase.auth().currentUser.email).limit(12).get().then((snapshot) => {
        this.animes = [];
        snapshot.forEach((doc) => { 
          let data = doc.data();
          Object.assign(data, {id: doc.id});
          Object.assign(data, {col: this.$route.params.collection})
          this.animes.push(data);
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
      })
    },
    checkScroll: function(){
      window.addEventListener('scroll', () => {
        if(window.innerHeight + window.scrollY >= document.body.offsetHeight) this.addAnimes();
      })
    },
    checkUserAndGet: function(){
      if(firebase.auth().currentUser) this.getStartAnimes();
    }
  },
  created(){
    firebase.auth().onAuthStateChanged((user) => {
      if(user) this.getStartAnimes()
      });
  },
  mounted(){
    this.checkScroll();
  },
  watch:{
    '$route' (){
      this.checkUserAndGet();
    }
  }
}
</script>
