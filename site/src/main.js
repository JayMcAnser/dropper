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


new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
