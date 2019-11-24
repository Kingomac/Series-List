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
      animes: [],
    }
  },
  methods:{
    setSnapshotAnimes: async function(){
      await firebase.firestore().collection(this.$route.params.collection).orderBy(this.$store.state.filtroOrden, this.$store.state.filtroOrdenSentido).onSnapshot((snapshot) => {
        this.animes = [];
        snapshot.forEach((doc) => { 
          let data = {
            nombre_jp: doc.data().nombre_jp,
            nombre_en: doc.data().nombre_en,
            imagen: doc.data().imagen,
            id: doc.id
          }
          if(this.$store.state.busqueda !== '' || this.$store.state.busqueda !== null){
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
  mounted(){
    this.setSnapshotAnimes();

  },
  watch:{
    '$route' (){
      this.setSnapshotAnimes();
    },
    '$store.state.busqueda' (){
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
