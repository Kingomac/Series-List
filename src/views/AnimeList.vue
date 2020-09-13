<template>
<v-flex>
  <search-window />
  <v-row align="stretch">
    <anime-card
      @hide="remove(key)"
      v-for="(a, key) in animes"
      :key="key"
      :show-chapter="showChapter"
      :data="a"
    />
  </v-row>
</v-flex>
</template>
<script>
import SearchWindow from '../components/SearchWindow.vue'
import AnimeCard from '../components/AnimeCard.vue'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import store from '../store'
export default {
  components: {
    AnimeCard,
    SearchWindow
  },
  props: {
    getCategoriaId: {
      type: Function,
      default: null
    },
    getAnimeId: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      animes: [],
      animeId: 0,
      loadedMore: 0
    }
  },
  computed: {
    showChapter: function () {
      if (this.getAnimeId === 0) return true
      else return false
    }
  },
  methods: {
    loadOnePlusAnime: async function () {
      store.commit('setLoadingAnimes', true)
      try {
        const plusanime = await firebase
          .firestore()
          .collection(this.$route.params.collection)
          .orderBy('actualizado_en', 'desc')
          .where('email', '==', firebase.auth().currentUser.email)
          .startAfter(this.animes[this.animes.length - 1].actualizado_en)
          .limit(1)
          .get()
        if (plusanime.docs.length > 0) {
          const newanime = Object.assign(plusanime.docs[0].data(), {
            id: plusanime.docs[0].id
          })
          store.state.animes[this.getAnimeId].push(newanime)
        }
      } catch (err) {
        console.log('There is no more anime')
      }
      await store.commit('setLoadingAnimes', false)
    },
    remove: async function (index) {
      store.state.animes[this.animeId].splice(index, 1)
      await this.loadOnePlusAnime()
    },
    getStartAnimes: async function () {
      store.commit('setLoadingAnimes', true)
      this.loadedMore = 0
      firebase
        .firestore()
        .collection(this.$route.params.collection)
        .orderBy('actualizado_en', 'desc')
        .where('email', '==', firebase.auth().currentUser.email)
        .limit(12)
        .get()
        .then((snapshot) => {
          this.animes = []
          this.processData(snapshot)
        })
        .then(() => {
          if (document.body.scrollHeight > document.body.clientHeight) {
            store.commit('setLoadingAnimes', false)
          } else {
            this.addAnimes()
          }
        })
    },
    processData: async function (snapshot) {
      await snapshot.forEach((doc) => {
        const data = doc.data()
        data.id = doc.id
        this.animes.push(data)
      })
      await store.commit('setAnimes', {
        id: this.animeId,
        animes: this.animes
      })
    },
    addAnimes: function () {
      store.commit('setLoadingAnimes', true)
      if (this.animes.length === 0) return
      firebase
        .firestore()
        .collection(this.$route.params.collection)
        .orderBy('actualizado_en', 'desc')
        .where('email', '==', firebase.auth().currentUser.email)
        .startAfter(this.animes[this.animes.length - 1].actualizado_en)
        .limit(6)
        .get()
        .then((snapshot) => {
          this.processData(snapshot)

          if (
            document.body.scrollHeight <= document.body.clientHeight &&
              this.loadedMore < 5
          ) {
            this.loadedMore += 1
            this.addAnimes()
          } else {
            store.commit('setLoadingAnimes', false)
          }
        })
    },
    checkScroll: function () {
      window.addEventListener('scroll', () => {
        if (
          window.innerHeight + window.scrollY >= document.body.offsetHeight &&
            !store.state.loadingAnimes
        ) { this.addAnimes() }
      })
    },
    checkUserAndGet: function () {
      if (firebase.auth().currentUser) this.getStartAnimes()
    },
    updateRoute: function () {
      this.animeId = this.getAnimeId
      if (store.state.animes[this.animeId].length > 0) {
        this.animes = store.state.animes[this.animeId]
        if (this.animes.length < 12) {
          this.addAnimes()
        }
      } else {
        this.getStartAnimes()
      }
    }
  },
  mounted () {
    if (this.getAnimeId === -1) {
      this.$router.push('/viendo')
    }
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$emit('updateUser')
        this.updateRoute()
      }
    })
    this.checkScroll()
  },
  watch: {
    $route: function () {
      this.updateRoute()
    }
  }
}
</script>
