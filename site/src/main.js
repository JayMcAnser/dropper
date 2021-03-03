import Vue from 'vue'
import App from './pages/index.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import VueZoomer from 'vue-zoomer';

Vue.config.devtools = process.env.NODE_ENV === 'development'
Vue.config.productionTip = false
Vue.use(VueZoomer)


// import VJsf from '@koumoul/vjsf'
// import '@koumoul/vjsf/dist/main.css'
// // load third-party dependencies (markdown-it, vuedraggable)
// // you can also load them separately based on your needs
// // import '@koumoul/vjsf/dist/third-party.js'
//
// Vue.component('VJsf', VJsf)

// console.log('env:', process.env.VUE_APP_API_URL)


new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
