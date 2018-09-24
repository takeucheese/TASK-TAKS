// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import firebase from 'firebase'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)

// Initialize Firebase
var config = {
  apiKey: 'AIzaSyCwshWiZf9VwkLandO717bbld09W6AAMes',
  authDomain: 'task-taks.firebaseapp.com',
  databaseURL: 'https://task-taks.firebaseio.com',
  projectId: 'task-taks',
  storageBucket: 'task-taks.appspot.com',
  messagingSenderId: '629492029573'
}
firebase.initializeApp(config)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
