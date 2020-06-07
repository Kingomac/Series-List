import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/:collection',
      name: 'categoria',
      component: () =>
        import('./views/AnimeList.vue')
    }
  ]
})
