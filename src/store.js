import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    busqueda: '',
    email: '',
    editar:{
      activado: false,
      anime:{
        id: '',
        nombre_jp: '',
        nombre_en: '',
        imagen: '',
        categoria: '',
        capitulo: 0
      }
    },
    titulo: false,
  },
  mutations: {
    setBusqueda(state, buscar) {
      state.busqueda = buscar;
    },
    iniciarEdicion(state, anime){
      state.editar.activado = true;
      state.editar.anime = anime;
    },
    finalizarEdicion(state){
      state.editar.activado = false;
    },
    setTitulo(state, value){
      state.titulo = value;
    },
    setOrden(state,value){
      state.filtroOrden = value;
    },
    setSentido(state, value){
      state.filtroOrdenSentido = value;
    }
  },
  actions: {

  }
})
