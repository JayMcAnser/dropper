

import {debug, newError} from "../vendors/lib/logging";
import Database from '../models/database';

export const state = () => ({
  database: {},
  board: {}
})

export const mutations = {
  increment(state) {

  },
  initDb(state) {
    state.database = new Database()
  },
  activate(state, id) {
    state.board = state.database.boardById(id)
  }
}

export const actions = {
  increment(context) {
    context.commit('increment')
  },

  async list({state, commit, dispatch}) {
    try {
      commit('initDb');
      let boards = await state.database.boards()
    //  debug(boards, 'store.board.list')
      return boards;
    } catch (e) {
      dispatch('status/error', newError(e, 'store.board.list'), {root: true})
      throw new Error(e.message)
    }
  },

  async activate({state, dispatch, getters}, data) {
    state.board = await state.database.boardById(data.id)
  }
}

export const getters = {
  data: (state) => {
    return state.elementClass;
  },
  active: (state) => {
    return state.board;
  },
  inventory: (state) => {
    return state.board.inventory
  }

}


export const board = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
