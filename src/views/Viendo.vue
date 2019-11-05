<template>
  <div>
    <anime-card v-for="(a, key) in animes" v-bind:key="key" :data="a"/>
  </div>
</template>
<script>
import AnimeCard from "../components/AnimeCard.vue";
import firebase from 'firebase/app'
import 'firebase/firestore'
export default {
  components:{
    AnimeCard
  },
  data(){
    return {
      collection: 'viendo',
      animes: [],
    }
  },
  methods:{
    setSnapshotAnimes: async function(){
      await firebase.firestore().collection(this.collection).orderBy(this.$store.state.filtroOrden, this.$store.state.filtroOrdenSentido).onSnapshot((snapshot) => {
        this.animes = [];
        snapshot.forEach((doc) => {
          let data = doc.data();
          Object.assign(data, { id: doc.id})
          if(this.$store.state.busqueda !== ''){
            if(data.nombre_jp.toLowerCase().startsWith(this.$store.state.busqueda.toLowerCase()) || data.nombre_en.toLowerCase().startsWith(this.$store.state.busqueda.toLowerCase())){
              this.animes.push(data);
            }
          }
          else{
            this.animes.push(data);
          }
        })
      })
    }
  },
  created(){
    this.setSnapshotAnimes();
  },
  watch: {
    '$store.state.busqueda' () {
      this.setSnapshotAnimes();
    },
    '$store.state.filtroOrden' (){
      this.setSnapshotAnimes();
    },
    '$store.state.filtroOrdenSentido' (){
      this.setSnapshotAnimes();
    }
  }
}
</script>
