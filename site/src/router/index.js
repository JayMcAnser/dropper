import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../pages/home.vue';
import AuthRoutes from '../vendors/router/auth-route';
import {routeMerge} from '../vendors/lib/route';

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
    component: () => import(/* webpackChunkName: "auth" */ '../pages/about.vue')
  },
  {
    path:'/boards',
    name:'boards',
    component: () => import(/* webpackChunkName: "boards" */ '../pages/boards.vue')
  },
  {
    path: '/boardNew',
    name: 'boardNew',
    component: () => import(/* webpackChunkName: "board" */ '../pages/board-edit.vue')
  },
  {
    path: '/boardEdit/:id',
    name: 'boardEdit',
    component: () => import(/* webpackChunkName: "board" */ '../pages/board-edit.vue')
  },
  {
    path: '/boardLayout/:id/:layout',
    name: 'boardLayout',
    component: () => import(/* webpackChunkName: "board" */ '../pages/layout.vue')
  },
  {
    path: '/board/:id?',  // if no id, the active is used
    name: 'board',
    component: () => import(/* webpackChunkName: "board" */ '../pages/board.vue')
  },
  {
    path: '/element/:boardId/:elementId',  // if no id, the active is used
    name: 'elementView',
    component: () => import(/* webpackChunkName: "element" */ '../pages/element-view.vue')
  },
  {
    path: '/search-board',  // if no id, the active is used
    name: 'searchBoard',
    component: () => import(/* webpackChunkName: "board" */ '../pages/search-board.vue')
  },


  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "auth" */ '../pages/login.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes:  routeMerge(
    AuthRoutes,
    routes              // should be last because it overload the previous ones
  )
})

export default router
