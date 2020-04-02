<template>
  <div>
    <v-switch
      color="#89DDFF"
      v-model="titulo"
      label="Inglés-Japonés"
    />
  </div>
</template>
<script>
export default {
  computed:{
    titulo:{
      set(value){
        this.$store.commit('setTitulo', value);
      },
      get(){
        return this.$store.state.titulo;
      }
    }
  }
}
</script>
<style>
.v-input--switch__track.theme--dark, .v-input--selection-controls__ripple, .v-input--selection-controls__input, .v-input--switch__thumb.theme--dark{
  background: #89DDFF !important;
}
</style>