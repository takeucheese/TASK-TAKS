<template>
  <div class="container text-center p-3">
    <b-alert
      variant="primary"
      dismissible
      :show="showSuccessAlert"
      @dismissed="showDSuccessAlert=false">
      登録に成功しました
    </b-alert>
    <b-alert
      variant="danger"
      dismissible
      :show="showFaildAlert"
      @dismissed="showFaildAlert=false">
      登録に失敗しました。
    </b-alert>
    <h2>タスク一覧</h2>
    <p>現在のアクティブなタスクは<strong> {{ tasks.length }} </strong>件です</p>
    <div>
    <b-btn v-b-toggle.collapse1 variant="secondary">タスクを追加する</b-btn>
      <b-collapse id="collapse1" class="mt-2">
        <b-form @submit="addTask">
          <b-card>
            <b-form-input
              class="m-2"
              id="title"
              type="text"
              v-model="title"
              placeholder="タイトル"
              required>
            </b-form-input>
            <b-form-textarea
              class="m-2" 
              id="body"
              v-model="body"
              placeholder="内容"
              :rows="3"
              :max-rows="6"
              required>
            </b-form-textarea>
            <b-btn type="submit" variant="outline-primary">登録</b-btn>
          </b-card>
        </b-form>
      </b-collapse>
    </div>
    <b-nav 
      class="mt-5 mx-auto d-flex justify-content-center align-items-center flex-wrap"
      pills>
        <b-nav-item
          class="mr-2"
          @click="showTaskType = 'all'"
          :active="showTaskType==='all'">
          すべて
        </b-nav-item>
        <b-nav-item
          class="mr-2"
          @click="showTaskType = 'active'"
          :active="showTaskType==='active'">
          アクティブ
        </b-nav-item>
        <b-nav-item
          class="mr-2"
          @click="showTaskType = 'complete'"
          :active="showTaskType==='complete'">
          完了
        </b-nav-item>
        <b-nav-item
        @click="showTaskType = 'delete'"
          :active="showTaskType==='delete'">
          削除済
        </b-nav-item>
    </b-nav>
    <div class="mt-2">
      <template
        class="d-flex flex-wrap mt-2" 
        v-if="fillerTasks">
        <b-card
          v-for="(task, index) in fillerTasks"
          :key="task.id"
          header="header"
          :title="task.title"
          style="width: 20rem; min-height: 15rem"
          class="d-inline-block m-2">
          <h6
            slot="header"
            class="mb-0 d-flex justify-content-between align-items-center">
            <div>
              <p class="mb-1">
                No.{{ index + 1 }}
              </p>
              <b-badge 
                variant="primary"
                v-if="isActive(task)">
                Active
              </b-badge>
              <b-badge 
                variant="secondary"
                v-if="task.completedUser"
                >
                Completed
              </b-badge>
              <b-badge 
                variant="danger"
                v-if="task.deleteTime">
                Deleted
              </b-badge>
            </div>
            <b-button
              v-if="isActive(task)"
              @click="deleteTask(index)"
              variant="outline-danger">
              削除
            </b-button>
          </h6>
          <p class="card-text">{{ task.body }}</p>
          <b-button
            v-if="isActive(task)"
            @click="completeTask(index)"
            class="mr-2"
            variant="outline-primary">
            完了
          </b-button>
          <b-button
            v-else-if="task.completedUser"
            @click="activeTask(index)"
            variant="outline-danger">
            取消
          </b-button>
          <b-button
            v-else-if="task.deleteTime"
            @click="restoreTask(index)"
            variant="outline-danger">
            復元
          </b-button>
          <b-button
            v-if="isActive(task)" 
            variant="outline-success">
            たくす
          </b-button>
        </b-card>
      </template>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
import moment from 'moment'

export default {
  name: 'Tasks',
  props: ['user'],
  data () {
    return {
      showSuccessAlert: false,
      showFaildAlert: false,
      showTaskType: 'active',
      title: '',
      body: '',
      tasks: [],
      completeTasks: [],
      deleteTasks: []
    }
  },
  computed: {
    id () {
      return this.tasks.length +
        this.completeTasks.length +
        this.deleteTasks.length + 1
    },
    fillerTasks () {
      if (this.showTaskType === 'active') {
        return this.tasks
      } else if (this.showTaskType === 'complete') {
        return this.completeTasks
      } else if (this.showTaskType === 'delete') {
        return this.deleteTasks
      } else {
        let fillterTasks = []
        fillterTasks.push(...this.tasks)
        fillterTasks.push(...this.completeTasks)
        fillterTasks.push(...this.deleteTasks)
        return fillterTasks
      }
    }
  },
  created: function () {
    const firestore = firebase.firestore()
    const settings = {
      /* your settings... */
      timestampsInSnapshots: true
    }
    firestore.settings(settings)
    firestore
      .collection('tasks')
      .doc(this.user.uid)
      .get()
      .then(doc => {
        if (doc.exists) {
          const data = doc.data()
          if (data.tasks) {
            this.tasks = data.tasks
          }
          if (data.deleteTasks) {
            this.deleteTasks = data.deleteTasks
          }
          if (data.completeTasks) {
            this.completeTasks = data.completeTasks
          }
        }
      })
  },
  methods: {
    isActive: (task) => {
      return !task.completedUser && !task.deleteTime
    },
    addTask () {
      this.tasks.push({
        id: this.id,
        createUser: this.user.uid,
        deleteTime: null,
        completedUser: null,
        title: this.title,
        body: this.body,
        sendTo: null
      })
      this.title = ''
      this.body = ''
      this.saveTasks() // タスクを保存
    },
    completeTask: function (index) {
      this.tasks[index].completedUser = this.user.uid
      this.completeTasks.push(this.tasks[index])
      this.tasks.splice(index, 1)
      this.saveTasks()
    },
    activeTask: function (index) {
      this.completeTasks[index].completedUser = null
      this.tasks.push(this.completeTasks[index])
      this.completeTasks.splice(index, 1)
      this.saveTasks()
    },
    deleteTask: function (index) {
      this.tasks[index].deleteTime =
        moment().format('YYYY-MM-DD hh:mm:ss')
      this.deleteTasks.push(this.tasks[index])
      this.tasks.splice(index, 1)
      this.saveTasks()
    },
    restoreTask: function (index) {
      this.deleteTasks[index].deleteTime = null
      this.tasks.push(this.deleteTasks[index])
      this.deleteTasks.splice(index, 1)
      this.saveTasks()
    },
    saveTasks () {
      const firestore = firebase.firestore()
      const uid = this.user.uid
      firestore
        .collection('tasks')
        .doc(uid)
        .set({
          tasks: this.tasks,
          completeTasks: this.completeTasks,
          deleteTasks: this.deleteTasks
        })
        .then(() => {
          this.showSuccessAlert = true
        })
        .catch(() => {
          this.showFaildAlert = true
        })
    }
  }
}
</script>
