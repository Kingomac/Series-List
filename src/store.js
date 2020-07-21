import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cardsWidth: 250,
    cardsHeight: 350,
    loadingAnimes: false,
    busqueda: '',
    email: '',
    editar: {
      activado: false,
      anime: {
        id: '',
        nombre_jp: '',
        nombre_en: '',
        imagen: '',
        categoria: '',
        capitulo: 0
      }
    },
    animes: [
      [], // viendo
      [], // vistos
      [], // favoritos
      [], // abandonados
      [] // pendientes
    ],
    titulo: false
  },
  mutations: {
    loadCardsSize (state) {
      const size = JSON.parse(window.localStorage.getItem('cardsSize'))
      console.log(size)
      if (size !== null) {
        state.cardsWidth = size.width
        state.cardsHeight = size.height
      }
    },
    addCardsSize (state) {
      if (state.cardsWidth < 500) {
        state.cardsWidth *= 1.1
        state.cardsHeight *= 1.1
      }
    },
    lessCardsSize (state) {
      if (state.cardsWidth > 150) {
        state.cardsWidth *= 0.9
        state.cardsHeight *= 0.9
      }
    },
    setLoadingAnimes (state, value) {
      state.loadingAnimes = value
    },
    setBusqueda (state, buscar) {
      state.busqueda = buscar
    },
    iniciarEdicion (state, anime) {
      state.editar.activado = true
      state.editar.anime = anime
    },
    finalizarEdicion (state) {
      state.editar.activado = false
    },
    setTitulo (state, value) {
      state.titulo = value
    },
    setOrden (state, value) {
      state.filtroOrden = value
    },
    setSentido (state, value) {
      state.filtroOrdenSentido = value
    },
    setAnimes (state, values) {
      state.animes[values.id] = values.animes
    },
    unshiftAnime (state, values) {
      state.animes[values.id].unshift(values.anime)
    }
  },
  actions: {

  }
})
