<template>
  <v-form>
    <v-text-field @keyup="updateSearch" clearable v-model="buscar"/>
  </v-form>
</template>
<script>
export default {
  data(){
    return {
      buscar: ''
    }
  },
  methods:{
    updateSearch: function(){
      this.$store.commit('setBusqueda', this.buscar)
    }
  }
}
</script>
