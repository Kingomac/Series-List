<template>
  <div>
    <v-switch color="primary" v-model="titulo" label="Inglés-Japonés"></v-switch>
    <v-switch color="info" v-model="filtroOrdenSentido" label="Descendiente - Ascendiente"></v-switch>
    <v-select :items="ordenes" item-value="value" item-text="text" v-model="filtroOrden"></v-select>
  </div>
</template>
<script>
export default {
  data(){
    return {
      ordenes: [{
        text: 'Actualización',
        value: 'actualizado_en'
      },{
        text: 'Nombre japonés',
        value: 'nombre_jp'
      },{
        text: 'Nombre inglés',
        value: 'nombre_en'
      }]
    }
  },
  computed:{
    titulo:{
      set(value){
        this.$store.commit('setTitulo', value);
      },
      get(){
        return this.$store.state.titulo;
      }
    },
    filtroOrden: {
      set(value){
        this.$store.commit('setOrden',value);
      },
      get(){
        return this.$store.state.filtroOrden;
      }
    },
    filtroOrdenSentido: {
      set(value){
        if(value) this.$store.commit('setSentido', 'asc');
        else this.$store.commit('setSentido', 'desc');
      },
      get(){
        return this.$store.state.filtroOrdenSentido;
      }
    },
  }
}
</script>
