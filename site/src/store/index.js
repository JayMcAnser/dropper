import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


import {board} from './board';
import {element} from './element';
import {auth} from '../vendors/store/auth';
import {status} from '../vendors/store/status';

const defaultModule = {    
  state: {
    counter: 0
  },
  mutations: {
    increment(state) {
      state.counter++
    }
  },
  actions: {
    increment(context) {
      context.commit('increment')
    }
  },
  getters: {
    count: (state) => {
      return state.counter
    }
  }
}
const store = new Vuex.Store({
  modules: {
    defaultModule,
    board: board,
    element,
    auth,
    status
  }
})

export default store;

// //actions.nuxtServerInit({commit: 1})
