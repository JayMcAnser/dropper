/**
 * connectiong to the API server
 * 
 * version 1.0 Jay 2021-02-03
 * see: https://forum.vuejs.org/t/add-header-token-to-axios-requests-after-login-action-in-vuex/38834/2
 */

import axios from 'axios'
import {debug, error} from './logging';

const axiosApi = axios.create({
  baseURL: (process.env.API_URL !== undefined) ? process.env.API_URL : 'http://localhost:3000',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})
debug(`api server: ${axiosApi.baseURL}`, 'lib/axios')

axios.cancelToken = axios.CancelToken;
axios.isCancel = axios.isCancel;

axiosApi.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem('authtoken')
    if (token) {
      config.headers['Authorization'] = `Bearer ${ token }`
    }
    return config
  },
  (error) => {
    error(error, 'lib/axios.interceptor')
    return Promise.reject(error)
  }
)

export default axiosApi;




// export default () => {
//     return axios.create({
//         baseURL: 'http://localhost:3000', // process.env.baseURL,
//         withCredentials: false,
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//         }
//     })
// }
