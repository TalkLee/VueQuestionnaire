<template lang="html">
  <div class="container">
    <div class="section">
      <h4 class="center-align">{{activeQ.title}}</h4>
      <h6 class='center-align'>{{activeQ.description}}</h6>
      <div class="divider"></div>
      <div class="questionListContainer">
        <div class="questionContainer card" v-for="q in activeQ.questionList">
          <div class="card-content">
            <div class="card-title">
              Q{{$index + 1}}&nbsp;&nbsp;{{q.caption}}
            </div>
            <div class="selectionListContainer">
              <div class="selectionContainer" v-for="s in q.selectionList">
                <template v-if="q.questionType === 1">
                  <input type="radio" id="{{s._id}}" name="{{q._id}}">
                  <label for="{{s._id}}" name="{{q._id}}">{{s.content}}</label>
                </template>
                <template v-if="q.questionType === 2">
                  <input type="checkbox" id="{{s._id}}">
                  <label for="{{s._id}}">{{s.content}}</label>
                </template>
              </div>
              <template v-if="q.questionType === 3">
                <label for="{{q._id}}">回答</label>
                <textarea  id="{{q._id}}" class="materialize-textarea"></textarea>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {saveQ} from '../../vuex/actions.js'
export default {
  data () {
    return {
    }
  },
  vuex: {
    getters: {
      Qlist: state => state.Qlist,
      activeQ: state => state.activeQ
    },
    actions: {
      saveQ
    }
  },
  attached() {

  },
  computed: {},
  methods: {
    formatData: function(vueObj) {
      return JSON.parse(JSON.stringify(vueObj))
    },
  },
  components: {}
}

</script>

<style lang="css">
</style>
