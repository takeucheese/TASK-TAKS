<template>
  <header>
    <b-navbar toggleable="sm" type="dark" variant="primary">

      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

      <b-navbar-brand href="/">TASK TAKS</b-navbar-brand>

      <b-collapse is-nav id="nav_collapse">

        <!-- <b-navbar-nav>
          <b-nav-item href="/#/task">タスク</b-nav-item>
          <b-nav-item href="/#/taks">たくす</b-nav-item>
        </b-navbar-nav> -->

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">

          <b-nav-item-dropdown right>
            <!-- Using button-content slot -->
            <template slot="button-content">
              <em v-if="user && user.displayName" class="gnav_name">
                {{ user.displayName }}
              </em>
              <em v-else class="gnav_name">
                {{ user.email }}
              </em>
            </template>
            <b-dropdown-item @click="signOut">ログアウト</b-dropdown-item>
            <b-dropdown-item @click="deleteAccount">アカウント削除</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>

      </b-collapse>
    </b-navbar>
  </header>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'Head',
  props: ['user'],
  methods: {
    signOut () {
      if (confirm('ログアウトします。よろしいですか？')) {
        firebase.auth().signOut().then(() => {
          this.$parent.isLogin = false
          this.$parent.userData = null
          this.$router.push('/signin')
        })
      }
    },
    deleteAccount () {
      if (confirm('アカウントを削除します。\n保存してあるデータも全て削除されます。\nよろしいですか？')) {
        firebase
          .auth()
          .currentUser
          .delete()
          .then(() => {
            alert('アカウントを削除しました。')
            // TODO: データの削除を行う
            this.$parent.isLogin = false
            this.$parent.userData = null
            this.$router.push('signin')
          })
          .catch(err => {
            alert(err.message)
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
