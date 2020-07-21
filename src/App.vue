<template>
  <v-app>
    <v-app-bar color="appbar" app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title class="headline m-2" :color="'deep-purple accent-4'">
        <span>Series List</span>
      </v-toolbar-title>
      <v-spacer />
      <v-btn @click="changeCardsSize(false)" icon><v-icon>mdi-minus-circle-outline</v-icon></v-btn>
      <v-btn @click="changeCardsSize(true)" icon><v-icon>mdi-plus-circle-outline</v-icon></v-btn>

      <v-img
        src="https://cdn130.picsart.com/294812797174211.png?r1024x1024"
        max-width="60px"
      />
    </v-app-bar>
    <v-navigation-drawer
      class="navigation"
      v-model="drawer"
      v-show="true"
      app
      clipped
    >
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header>Añadir</v-expansion-panel-header>
          <v-expansion-panel-content
            ><Create :get-anime-id="getAnimeId"
          /></v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>Buscar</v-expansion-panel-header>
          <v-expansion-panel-content><Search /></v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel value="1" v-if="editar">
          <v-expansion-panel-header>Editar</v-expansion-panel-header>
          <v-expansion-panel-content><Edit /></v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>Filtros</v-expansion-panel-header>
          <v-expansion-panel-content><Filters /></v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel v-if="!signedIn">
          <v-expansion-panel-header>Iniciar sesión</v-expansion-panel-header>
          <v-expansion-panel-content><Iniciar /></v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-list-item @click="signOut" v-if="signedIn">
        Cerrar sesión
      </v-list-item>
    </v-navigation-drawer>
    <v-main>
      <Tabs />
      <v-container>
        <router-view :get-anime-id="getAnimeId" @updateUser="setSignedIn" />
      </v-container>
      <v-bottom-navigation
        v-if="$store.state.loadingAnimes"
        height="5"
        color="appbar"
        fixed
      >
        <v-progress-linear indeterminate />
      </v-bottom-navigation>
    </v-main>
  </v-app>
</template>

<script>
import Tabs from './components/Tabs'
import Create from './components/Create'
import Search from './components/Search'
import Iniciar from './components/Iniciar'
import Edit from './components/Edit'
import Filters from './components/Filters'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import store from './store'

export default {
  name: 'App',
  components: {
    Tabs,
    Create,
    Search,
    Iniciar,
    Edit,
    Filters
  },
  data: () => ({
    drawer: null,
    signedIn: false
  }),
  computed: {
    editar: function () {
      return store.state.editar.activado
    },
    getAnimeId: function () {
      switch (this.$route.params.collection) {
        case 'viendo':
          return 0
        case 'vistos':
          return 1
        case 'favoritos':
          return 2
        case 'abandonados':
          return 3
        case 'pendientes':
          return 4
        default:
          return -1
      }
    }
  },
  methods: {
    changeCardsSize: function (sum) {
      if (sum) {
        this.$store.commit('addCardsSize')
      } else {
        this.$store.commit('lessCardsSize')
      }
      window.localStorage.setItem('cardsSize', JSON.stringify({ width: this.$store.state.cardsWidth, height: this.$store.state.cardsHeight }))
    },
    setSignedIn: function () {
      if (firebase.auth().currentUser) this.signedIn = true
      else this.signedIn = false
    },
    signOut: function () {
      firebase.auth().signOut()
      this.signedIn = false
    }
  },
  mounted () {
    if (this.getAnimeId === -1) {
      this.$router.push('/viendo')
    }
    this.$store.commit('loadCardsSize')
  }
}
</script>
<style>
  .v-card__text,
  .v-card__title {
    word-break: normal !important;
    line-height: 110% !important;
  }
  .navigation,
  .navigation div,
  .navigation.v-expansion-panel-header {
    background-color: #2f333d !important;
  }
  .v-content {
    background: #22242e !important;
  }
</style>
