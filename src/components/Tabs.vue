<template>
  <v-tabs fixed-tabs>
    <v-tab to="/viendo">
      Viendo
    </v-tab>
    <v-tab to="/vistos">
      Vistos
    </v-tab>
    <v-tab to="/favoritos">
      Favoritos
    </v-tab>
    <v-tab to="/abandonados">
      Abandonados
    </v-tab>
    <v-tab to="/pendientes">
      Pendientes
    </v-tab>
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
