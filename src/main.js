import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import store from './store'
import firebase from 'firebase/app'
import {firebase_config} from '../app.config'

Vue.config.productionTip = false;

firebase.initializeApp(firebase_config);

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount("#app");
