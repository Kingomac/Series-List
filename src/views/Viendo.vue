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
    setSnapshotAnimes: async function(){
      await firebase.firestore().collection('viendo').where('email', '==', firebase.auth().currentUser.email).orderBy('actualizado_en','desc').onSnapshot((snapshot) => {
        this.animes = [];
        snapshot.forEach((doc) => {
          let data = doc.data();
          Object.assign(data, { id: doc.id})
          Object.assign(data, { visible: false })
          Object.assign(data, { col: 'viendo' })
          this.animes.push(data);
        })
      })
    }
  },
  mounted(){
    firebase.auth().onAuthStateChanged(() => {
      this.setSnapshotAnimes();
      this.$emit('updateUser');
    })
  },
}
</script>
