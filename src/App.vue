<template>
  <v-app>
    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
      <v-toolbar-title
        class="headline m-2"
        :color="'deep-purple accent-4'"
      >
        <span>Series List</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-img src="https://cdn130.picsart.com/294812797174211.png?r1024x1024" max-width="60px"/>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" v-show="true" app clipped>
      <v-expansion-panels multiple>
        <v-expansion-panel>
          <v-expansion-panel-header>Añadir</v-expansion-panel-header>
          <v-expansion-panel-content><Create/></v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>Buscar</v-expansion-panel-header>
            <v-expansion-panel-content><Search/></v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel value="1" v-if="editar">
            <v-expansion-panel-header>Editar</v-expansion-panel-header>
            <v-expansion-panel-content><Edit/></v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>Filtros</v-expansion-panel-header>
            <v-expansion-panel-content><Filters/></v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel v-if="!signedIn">
            <v-expansion-panel-header>Iniciar sesión</v-expansion-panel-header>
            <v-expansion-panel-content><Iniciar/></v-expansion-panel-content>
          </v-expansion-panel>
      </v-expansion-panels>
      <v-list-item @click="signOut" v-if="signedIn">
            Cerrar sesión
      </v-list-item>
  </v-navigation-drawer>
    <v-content>
      <Tabs/>
      <v-container>
      <router-view/>
      </v-container>
        </v-content>
  </v-app>
</template>

<script>
import Tabs from './components/Tabs';
import Create from './components/Create';
import Search from './components/Search';
import Iniciar from './components/Iniciar';
import Edit from './components/Edit';
import Filters from './components/Filters';
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import store from './store'

export default {
  name: "App",
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
    usuarios: []
  }),
  mounted(){
    firebase.initializeApp({
      apiKey: "AIzaSyBF3Q8IMzrcBjPROUKjPfaVq0ZiQfOnCPo",
      authDomain: "what-anime-i-see.firebaseapp.com",
      databaseURL: "https://what-anime-i-see.firebaseio.com",
      projectId: "what-anime-i-see",
      storageBucket: "what-anime-i-see.appspot.com",
      messagingSenderId: "239560464048",
      appId: "1:239560464048:web:5f6e2c6391780d896e0d75"
    });
    this.getUsers();
  },
  computed:{
    signedIn: function(){
      return store.state.signedIn;
    },
    editar: function(){
      return store.state.editar.activado;
    }
  },
  methods:{
    signOut: function(){
      store.commit('sesionCerrada');
      firebase.auth().signOut();
    },
    setUserAuthChange: function(){
      firebase.auth().onAuthStateChanged((user) => {
      if(user){
        if(this.usuarios.includes(user.email)){
          store.commit('sesionIniciada');
        }
        else{
          firebase.auth().signOut();
        }
      }
      else{
        store.commit('sesionCerrada');
      }
    })
    },
    getUsers: function(){
      firebase.firestore().collection('usuarios').get().then((col) => {
        col.forEach((doc) => {
          this.usuarios.push(doc.data().email);
        })
        this.setUserAuthChange();
      })
    }
  }
};
</script>
<style>
.v-card__text, .v-card__title {
  word-break: normal !important;
}
</style>