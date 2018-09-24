<template>
  <div id="app">

    <Head v-if="userData" :user="userData"></Head>
    
    <main>
      <router-view
        :user="userData"
      ></router-view>
    </main>
    
    <Foot/>

  </div>
</template>

<script>
import firebase from 'firebase'
import Head from './components/Head'
import Foot from './components/Foot'
export default {
  name: 'App',
  data () {
    return {
      isLogin: false,
      isLoginState: false,
      userData: null
    }
  },
  mounted () {
    firebase.auth().onAuthStateChanged(user => {
      this.isLoginState = true
      console.log(user)
      if (user) {
        this.isLogin = true
        this.userData = user
      } else {
        this.isLogin = false
        this.userData = null
      }
    })
  },
  components: {
    'Head': Head,
    'Foot': Foot
  }
}
</script>

<style lang="scss" scoped>
header {
  position: fixed;
  width: 100%;
  height: 30px;
  z-index: 100;
}

main {
  padding-top: 50px;
}
</style>

