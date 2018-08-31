import Vue from 'vue'
const VueAnalytics = require('vue-analytics').default;
import App from './App.vue'

Vue.config.productionTip = false
Vue.use(VueAnalytics, {
  id: 'UA-52525161-9',
  disabled: process.env.NODE_ENV === 'development'
});

new Vue({
  render: h => h(App)
}).$mount('#app')
