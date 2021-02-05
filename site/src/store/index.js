import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


import {board} from './board';
import {auth} from './auth';
import {status} from './status';

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
    auth,
    status
  }
})

export default store;

// //actions.nuxtServerInit({commit: 1})
