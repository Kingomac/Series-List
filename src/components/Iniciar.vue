<template>
  <div>
    <v-btn
      block
      @click="google"
    >
      Iniciar sesión
    </v-btn>
  </div>
</template>
<script>
import firebase from 'firebase/app'
import 'firebase/auth'
export default {
  methods: {
    google: function () {
      firebase.auth().signOut()
      var provider = new firebase.auth.GoogleAuthProvider()
      provider.addScope('email')
      firebase.auth().signInWithRedirect(provider)
      firebase.auth().getRedirectResult()
    }
  }
}
</script>
