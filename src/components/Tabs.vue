<template>
  <v-tabs fixed-tabs>
        <v-tab to="/">Viendo</v-tab>
        <v-tab to="/categoria/vistos">Vistos</v-tab>
        <v-tab to="/categoria/favoritos">Favoritos</v-tab>
        <v-tab to="/categoria/abandonados">Abandonados</v-tab>
        <v-tab to="/categoria/pendientes">Pendientes</v-tab>
      </v-tabs>
</template>
<script>
export default {
  methods:{
    changeRoute: async function(to){
      this.$router.push(to);
      this.$emit('updatecards');
    }
  }
}
</script>
<style>
.v-tabs-bar{
  background-color: #2F333D !important;
}
</style>
