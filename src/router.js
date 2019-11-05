import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
      path: "/",
      name: "viendo",
      component: () =>
        import ("./views/Viendo.vue")
    },
    {
      path: "/categoria/:collection",
      name: "categoria",
      component: () =>
        import ("./views/Otros.vue")
    }
  ]
})
