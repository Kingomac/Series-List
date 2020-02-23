<template>
  <v-app>
    <v-app-bar color="appbar" app clipped-left>
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
    <v-navigation-drawer class="navigation" v-model="drawer" v-show="true" app clipped>
      <v-expansion-panels>
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
      <router-view v-on:updateUser="setSignedIn"/>
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
    signedIn: false
  }),
  computed:{
    editar: function(){
      return store.state.editar.activado;
    }
  },
  methods:{
    setSignedIn: function(){
      if(firebase.auth().currentUser) this.signedIn = true;
      else this.signedIn = false;
    },
    signOut: function(){
      firebase.auth().signOut();
    }
    /*migrar: function(){
      let categorias = ['viendo', 'pendientes', 'vistos', 'favoritos', 'odiados'];
      categorias.forEach((categoria) => {
        firebase.firestore().collection(categoria).get().then((all) => {
          all.forEach((anime) => {
            let newData = anime.data();
            Object.assign(newData, {email: 'vcmario3@gmail.com'});
            firebase.firestore().collection(categoria).doc().set(newData).then(() => {
              console.log(newData.nombre_jp, "updated");
              firebase.firestore().collection(categoria).doc(anime.id).delete();
            })
          })
        })
      })
    }*/
  }
};
</script>
<style>
.v-card__text, .v-card__title {
  word-break: normal !important;
  line-height: 110% !important;
}
.navigation, .navigation div, .navigation.v-expansion-panel-header{
  background-color: #2F333D !important;
}
.v-content{
  background: #22242e !important;
}
</style>