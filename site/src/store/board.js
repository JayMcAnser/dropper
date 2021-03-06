

import {debug, newError} from "../vendors/lib/logging";
import Database from '../models/database';
import Board from '../models/board';

export const state = () => ({
  database: {},
  board: {}
})

export const mutations = {
  increment(state) {

  },
  initDb(state) {
    if (!Object.keys(state.database).length) {
//      debug('connect database', 'store.board.initDb')
      state.database = new Database()
   }
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
  async create({state, commit, dispatch}, data) {
    try {
      await dispatch('status/clear', undefined, {root: true})
      commit('initDb');
      state.board = await state.database.boardNew();
      debug(state.board.id,'board.create')
    } catch (e) {
      await dispatch('status/error', e, {root: true});
      throw e
    }
  },


  async save({state, dispatch}) {
    if (state.board) {
      await dispatch('status/clear', undefined, {root: true})
      try {
        await state.board.save();
      } catch (e) {
        await dispatch('status/error', e, {root: true});
        throw e
      }
    }
  },
  async cancel({state}) {
    if (state.board) {
      await dispatch('status/clear', undefined, {root: true});
      try {
        await state.board.cancel();
      } catch (e) {
        await dispatch('status/error', e, {root: true});
      }
    }
  },

  async activate({state, commit}, data) {
    if (!Object.keys(state.board).length || state.board.id !== data.id) {
      commit('initDb')
      state.board = await state.database.boardById(data.id);
      debug(data.id, 'board.active')
    }
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
