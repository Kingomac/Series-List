<template>
  <div>
    <anime-card v-for="(a, key) in filteredAnimes" v-bind:key="key" mostrarCapitulo="true" :data="a"/>
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
      animes: []
    }
  },
  computed:{
    filteredAnimes: function(){
      let result = [];
      this.animes.forEach((a) => {
        if(a.visible) result.push(a);
      })
      return result;
    }
  },
  methods:{
    setSnapshotAnimes: async function(){
      await firebase.firestore().collection(this.collection).orderBy(this.$store.state.filtroOrden, this.$store.state.filtroOrdenSentido).onSnapshot((snapshot) => {
        this.animes = [];
        snapshot.forEach((doc) => {
          let data = doc.data();
          Object.assign(data, { id: doc.id})
          Object.assign(data, { visible: false })
          this.animes.push(data);
        })
        this.seleccionarAnimes();
      })
    },
    seleccionarAnimes: async function(){
      this.animes_visibles = [];
      this.animes.forEach((a) => {
        if(this.$store.state.busqueda !== '' && this.$store.state.busqueda !== null){
          if(a.nombre_jp.toLowerCase().startsWith(this.$store.state.busqueda.toLowerCase()) || a.nombre_en.toLowerCase().startsWith(this.$store.state.busqueda.toLowerCase())){
            a.visible = true;
          }
        }
        else{
          a.visible = true;
        }
      })
    }
  },
  created(){
    this.setSnapshotAnimes();
  },
  watch: {
    '$store.state.busqueda' () {
      this.seleccionarAnimes();
    },
    '$store.state.filtroOrden' (){
      this.seleccionarAnimes();
    },
    '$store.state.filtroOrdenSentido' (){
      this.seleccionarAnimes();
    }
  }
}
</script>
