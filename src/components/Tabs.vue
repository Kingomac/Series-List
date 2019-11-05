<template>
  <v-tabs fixed-tabs>
        <v-tab to="/">Viendo</v-tab>
        <v-tab to="/categoria/vistos">Vistos</v-tab>
        <v-tab to="/categoria/favoritos">Favoritos</v-tab>
        <v-tab to="/categoria/odiados">Odiados</v-tab>
        <v-tab to="/categoria/pendientes">Pendientes</v-tab>
      </v-tabs>
</template>
<script>
export default {
  methods:{
    changeRoute: function(to){
      this.$router.push(to);
      this.$emit('updatecards');
    }
  }
}
</script>
