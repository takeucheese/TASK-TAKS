<template>
  <div class="container">

    <div class="m-3 text-center" id="signin_wrapper">
      <p><img src="@/assets/img/icon_152.png"></p>
      <h1>
        <span class="d-block p-2">タスクをたくす</span>
        <span class="d-block p-2">進捗管理アプリ</span>
      </h1>
    </div>

    <div class="row">

      <div class="col-12 col-md-6 text-center" id="signin_container">
        <h2>ログイン</h2>
        <b-form @submit="signIn">
          <b-form-input
            class="m-2"
            id="email"
            type="email"
            v-model="email"
            placeholder="メールアドレス"
            required>
          </b-form-input>
          <b-form-input
            class="m-2"
            id="password"
            type="password"
            v-model="password"
            placeholder="パスワード"
            required>
          </b-form-input>
          <p>
            <b-button type="submit" variant="primary">ログイン</b-button>
          </p>
          <p>
            <b-button variant="secondary" @click="googleLogin">Googleアカウントでログイン</b-button>
          </p>
        </b-form>
      </div>

      <div class="col-12 col-md-6 text-center" id="signup_container">
        <h2>登録</h2>
        <b-form @submit="signUp">
          <b-form-input
            class="m-2"
            id="new_email"
            type="email"
            v-model="newemail"
            placeholder="メールアドレス"
            required>
          </b-form-input>
          <b-form-input
            class="m-2"
            id="new_password"
            type="password"
            v-model="newpassword"
            placeholder="パスワード"
            required>
          </b-form-input>
          <p>
            <b-button type="submit" variant="danger">登録</b-button>
          </p>
        </b-form>
      </div>

    </div>
    
  </div>
</template>

<script>
import firebase from 'firebase/app'
export default {
  name: 'Signin',
  data () {
    return {
      email: '',
      password: '',
      newemail: '',
      newpassword: ''
    }
  },
  mounted () {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$router.push('/')
      }
    })
  },
  methods: {
    signUp () {
      this.$parent.isLoginState = false
      const protocol = location.protocol + '//'
      const redirect = {
        url: protocol + window.location.host + '/#/signin'
      }
      firebase.auth().createUserWithEmailAndPassword(this.newemail, this.newpassword)
        .then(user => {
          const cUser = firebase.auth().currentUser
          // Emailの確認もつけておく
          cUser
            .sendEmailVerification(redirect)
            .then(() => {
              alert(cUser.email + 'に登録確認メールを送信しました。')
            })
            .catch(err => {
              alert(err.code, err.message)
            })
          this.$parent.isLoginState = true
        })
        .catch(err => {
          if (err.code === 'auth/invalid-email') {
            alert('不正なメールアドレスです。')
          } else if (err.code === 'auth/weak-password') {
            alert('パスワードは6文字以上入力してください。')
          } else if (err.code === 'auth/email-already-in-use') {
            alert('入力したメールアドレスは既に登録されています。')
          }
          this.$parent.isLoginState = true
        })
    },
    signOut () {
      firebase.auth().signOut().then(() => {
        this.$parent.isLogin = false
        this.$parent.userData = null
        this.$router.push('/signin')
      })
    },
    signIn () {
      firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        .then(user => {
          this.$router.push('/')
        })
        .catch(err => {
          if (err.code === 'auth/invalid-email') {
            alert('不正なメールアドレスです。')
          } else if (err.code === 'auth/wrong-password') {
            alert('パスワードが違います。')
          } else if (err.code === 'auth/user-not-found') {
            alert('登録されていないユーザーです。')
          }
        })
    },
    googleLogin () {
      firebase.auth().signInWithRedirect(new firebase.auth.GoogleAuthProvider())
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
#signin_container, #signup_container {
  box-sizing: border-box;
  width: 50%;
  padding: 20px;
}
</style>
