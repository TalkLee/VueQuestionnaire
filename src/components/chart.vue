<template lang="html">
  <div class="chart-container">
    <chart :options='bar' v-ref:bar v-if='question.questionType === 3 ' class="center-align"></chart>
    <chart :options='pie' v-ref:pie v-else class="center-align"></chart>
  </div>
</template>

<script>
import chart from './ECharts.vue'
export default {
  data: function() {
    // 转化为原始对象，否则存在getter setter 方法无法直接访问对象属性
    var  question= JSON.parse(JSON.stringify(this.question))
    if(question.selectionList.length !== 0) {
      var seriesData = []
      for (let i = 0; i < question.selectionList.length; i++) {
        var keyData = {};
        keyData.name = question.selectionList[i].content
        keyData.value = question.selectionList[i].selectCount
        seriesData.push(keyData)
      }
    }

    return {
      pie: {
        title: {
          text: question.caption
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: [{
          type: 'pie',
          name: '单选题',
          radius: '70%',
          data: seriesData || ''
        }]
      },
      bar: {
        title: {
          text: question.caption
        },
        tooltip: {},
        color: ['#c23531'],
        xAxis: {},
        yAxis :
            {
                type : 'category',
                data : ['有效答案'],
                axisTick : {
                    alignWithLabel : true
                }
            },
        series: [{
            type:'bar',
            data:[new Number(question.effectiveTextNum).toString()],
            barWidth:'70%'
          }]
      }
    }
  },
  computed: {},
  ready() {},
  attached() {},
  methods: {},
  props: ['question'],
  components: {
    chart
  }
}
</script>

<style lang="css">
</style>
