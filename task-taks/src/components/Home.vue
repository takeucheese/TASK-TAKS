<template>
  <div id="home">
    <h1>{{ msg }}</h1>
      <button @click="googleLogin">Googleアカウントでログイン</button>
  </div>
</template>

<script>
import firebase from 'firebase'
export default {
  name: 'home',
  data () {
    return {
      msg: 'Welcome to MyFirstVueApp'
    }
  },
  methods: {
    googleLogin: function () {
      firebase
        .auth()
        .signInWithRedirect(new firebase.auth.GoogleAuthProvider())
    }
  }
}
</script>
