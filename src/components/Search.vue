<template>
  <v-text-field clearable v-model="buscar"/>
</template>
<script>
export default {
  computed: {
    buscar:{
      get(){
        return this.$store.state.busqueda;
      },
      set(value){
        this.$store.commit('setBusqueda',value);
      }
    }
  }
}
</script>
