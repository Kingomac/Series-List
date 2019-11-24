import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    busqueda: '',
    signedIn: false,
    editar:{
      activado: false,
      anime:{
        id: '',
        col: '',
        nombre_jp: '',
        nombre_en: '',
        imagen: ''
      }
    },
    titulo: false,
    filtroOrden: 'actualizado_en',
    filtroOrdenSentido: 'desc',
  },
  mutations: {
    setBusqueda(state, buscar) {
      state.busqueda = buscar;
    },
    sesionIniciada(state) {
      state.signedIn = true;
    },
    sesionCerrada(state) {
      state.signedIn = false;
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
    },
    setNumAnimes(state, data){
      state.numAnimes[data.index] = data.value;
    }
  },
  actions: {

  }
})
