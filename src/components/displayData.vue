<template lang="html">
  <div class="container">
    <header>
      <h4 class="center-align">{{activeQ.title}}</h4>
      <h6 class='center-align'>{{activeQ.description}}</h6>
    </header>
    <div class="questionContainer">
      <div class="question" v-for="q in activeQ.questionList">
        <figure>
          <figcaption>
            <span>Q {{$index}}</span>
            <span>{{q.caption}}</span>
          </figcaption>
          <chart :question="q"></chart>
        </figure>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
import chart from './chart.vue'
export default {
  data() {
    return {
      tmpActiveQ: {}
    }
  },
  vuex: {
    getters: {
      activeQ: state => state.activeQ
    }
  },
  computed: {},
  ready() {},
  attached() {
    this.tmpActiveQ = this.$store.state.activeQ
      // 生成图表
  },
  methods: {},
  components: {
    chart
  }
}
</script>

<style lang="css">
.chartContainer{
  width:400px;
  height:100px;
}
</style>
