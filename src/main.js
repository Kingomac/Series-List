import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import store from './store'
import firebase from 'firebase/app'
import { firebaseConfig } from '../app.config'

Vue.config.productionTip = false

firebase.initializeApp(firebaseConfig)

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
