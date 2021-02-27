import Axios from "../vendors/lib/axios";

global.window = {}
import 'mock-local-storage'
window.localStorage = global.localStorage
const Username = 'test@dropper.info';
const Password = '123456';
let User = {}

module.exports.AuthToken = new Promise((resolve) => {
   return Axios.post('/auth', {
      username: Username,
      password: Password
    }).then(result => {
      if (result.status === 200 && result.errors === undefined) {
        let User = result.data.data.user;
        resolve(result.data.data.token)
      } else {
        console.error(result.data.data.errors)
        throw new Error(`could not login`);
      }
   })
  })

