<template>
  <v-snackbar :timeout="5000" v-model="mostrar">
    {{texto}}
  </v-snackbar>
</template>
<script>
export default {
  data(){
    return{
      mostrar: false,
      texto: 'gdfggfdgff'
    }
  }
}
</script>
