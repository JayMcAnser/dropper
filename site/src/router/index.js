import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../pages/home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../pages/about.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../pages/login.vue')
  },
  {
    path:'/boards',
    name:'boards',
    component: () => import(/* webpackChunkName: "boards" */ '../pages/boards.vue')
  },
  {
    path: '/board/:id',
    name: 'board',
    component: () => import(/* webpackChunkName: "board" */ '../pages/board.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
