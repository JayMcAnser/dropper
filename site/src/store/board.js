
import { axiosActions } from '../vendors/lib/const';
import { debug, warn, error, newError } from '../vendors/lib/logging';
import Axios from '../vendors/lib/axios';
import {apiState} from '../vendors/lib/const';
// import {Headers} from '../vendors/lib/axios';

const isNew = (data) => {
  return data.id === undefined
}
export const state = () => ({
  activeColumnIndex: 0,
  boards: [],
  activeBoardIndex: -1,
  counter: 0
})

export const mutations = {
  increment(state) {
    state.counter++
  },
  activeColumnIndex(state, index) {
    state.activeColumnIndex = index
  },
  /**
   * update the full list of all boards
   * @param {} state 
   * @param {*} boards 
   */
  setBoards(state, boards) {
    // todo: it should not replace is but merge is. 
    // because it just takes more time
    state.boards = boards
  },
  /**
   * update one board to the full list
   * returns index or false if not found
   */
  setBoard(state, board) {
    let index = state.boards.findIndex( (b) => b.id === board.id);
    if (index < 0) {
      error(`board ${board.id} not found`)
      state.activeBoardIndex = -1
      return false;
    } 
    state.boards[index] = board;    
    return index
  },
  activateBoard(state, board) {
    let index = state.boards.findIndex( (b) => b.id === board.id);
    if (index !== false) {
      if (state.activeBoardIndex !== index) {
        // only change the active index if it changes
        state.activeColumnIndex = 0;
        state.activeBoardIndex = index
      }
    }  
  }
}

const generateHeaders = (rootGetters) => {
  return  {
    headers: Headers(rootGetters['auth/authHeader'])
  }
}

export const actions = {
  increment(context) {
    context.commit('increment')
  },
  // async activate(context, index) {
  //   context.commit('activeColumnIndex', index)
  // },
  /**
   * dummy to check if the api is up and running
   */
  // async getActive() {
  //   try {
  //     let res = await this.$axios.get('/');
  //     if (axiosActions.isOk(res)) {
  //       return axiosActions.data(res);
  //     } else {
  //       error(axiosActions.errors(res), 'board.getActive');
  //       throw new Error(axiosActions.errorMessage(res));
  //     }
  //   }  catch(e) {
  //     error(e.message, 'board.getActive')
  //   }
  // },

  /**
   * list all information from one board
   */
  async list({commit, dispatch, getters}) {
    const FUN = 'store.board.load'    
    await dispatch('status/clear', '', {root: true})
    if (getters.boards.length) {
      // do not reload the board list if not needed
      // if we do, the column(s) getters can return empty values
      // because the columns are not yet loaded.
      debug(`serving from cache`, FUN)
      return getters.boards
    }
    try {
      debug(`loading from cache`, FUN)
      let res = await Axios.get('/public/list');
      if (axiosActions.isOk(res)) {
        commit('setBoards', axiosActions.data(res));
        commit('activeColumnIndex', 0)
        return getters.boards;
      }      
      let err = newError(axiosActions.errors(res), FUN)      
      dispatch('status/error', err, {root: true})
      throw err;``
    } catch (e) {           
      dispatch('status/error', newError(e, FUN), {root: true})      
      throw new Error(e.message)
    }
  },
    

  /**
   * defines the current board by setting the id
   * @param {*} data Object: {id}
   */
  async activate({commit, dispatch, getters}, data) {
    const FUN = 'store.board.activate'
    await dispatch('status/clear', '', {root: true})
    try {      
      let url = `/public/openById/${data.id}`
      await dispatch('status/apiStatus', apiState.waiting)
      let res = await Axios.get(url);   
      if (axiosActions.isOk(res)) {       
        await dispatch('status/apiStatus', apiState.ready)
        commit('setBoard', axiosActions.data(res));
        commit('activateBoard', axiosActions.data(res))  
        return getters.active;
      } else if (axiosActions.hasErrors(res)) {
        let err = newError(axiosActions.errors(res), FUN)      
        dispatch('status/error', err, {root: true})                
      } else {
        warn(axiosActions.data(res), FUN)
        return axiosActions.data(res)
      }
    } catch(e) {
      dispatch('status/error', newError(e, FUN), {root: true}) 
      throw e;
    }
  },

  async open({commit, dispatch}, data) {
    const FUN = 'store.board.open';
    await dispatch('status/clear', '', {root: true});
    try {

      let url = `/public/openById/${data.id}`
      let res = await Axios.get(url);   
      if (axiosActions.isOk(res)) {       
        commit('setBoard', axiosActions.data(res));
        return axiosActions.data(res)
      } else if (axiosActions.hasErrors(res)) {
        let err = newError(axiosActions.errors(res), FUN)      
        dispatch('status/error', err, {root: true})                
        return false;
      } else {
        warn(axiosActions.data(res), FUN)
        return axiosActions.data(res)
      }
    } catch(e) {
      dispatch('status/error', newError(e, FUN), {root: true}) 
      throw e;
    }
  },

  async save({commit, dispatch, rootGetters}, data) {
    const FUN = 'store.board.save';
    await dispatch('status/clear', '', {root: true});
    let result;
    try {
      Headers(rootGetters['auth/token'])
      if (isNew(data)) {
        result = await Axios.post('/board', data);
      } else {
        result = await Axios.patch(`board/${data.id}`, data)
      }
      if (axiosActions.isOk(result)) {   
        return  axiosActions.data(result)
      } else {
        let err = newError(axiosActions.errors(result), FUN)      
        dispatch('status/error', err, {root: true})                
        return false;
      }
    } catch(e) {
      dispatch('status/error', newError(e, FUN), {root: true}) 
      throw e;
    }
  }
}


export const getters = {
  boards: state => {
    return state.boards;
  },
  activeColumnIndex: state => {
    return state.activeColumnIndex;
  },
  active: state => {    
    if (state.activeBoardIndex < 0 || state.activeBoardIndex >= state.boards.length) {
      return {columns: []} // an invalid board
    } else {
      return state.boards[state.activeBoardIndex];
    }
  },
  column: (state) => {
    const LOC = 'board.column'    
    let board = getters.active(state)    
    if (state.activeColumnIndex < 0 || ! board.columns || state.activeColumnIndex >= board.columns.length) {
      return {}
    }
    return board.columns[state.activeColumnIndex]
  },
  columns: (state) => {   
    let board = getters.active(state)
    return board.columns
  },
  count: (state) => {
    return state.counter
  },
  publicImageRoot: (state, getters) => {
    return Axios.defaults.baseURL + '/public/image/' + getters.active.id + '/'
  },   
}

export const board = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
