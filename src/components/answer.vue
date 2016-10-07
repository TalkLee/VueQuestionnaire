<!--
  radio 绑定到一个字符串
  checkbox 绑定到一个数组
  text 绑定到一个字符串
 -->
<template lang="html">
  <div class="container">
    <div class="section">
      <h4 class="center-align">{{tmpActiveQ.title}}</h4>
      <h6 class="center-align">{{tmpActiveQ.description}}</h6>
      <div class="divider"></div>
      <div class="questionListContainer">
        <div class="questionContainer card" v-for="q in tmpActiveQ.questionList">
          <div class="card-content">
            <div class="card-title">
              Q{{$index + 1}}&nbsp;&nbsp;{{q.caption}}
            </div>
            <div class="selectionListContainer">
              <div class="selectionContainer" v-for="s in q.selectionList">
                <template v-if="q.questionType === 1">
                  <input type="radio" id="selection{{q.questionIndex}}_{{$index}}"
                  name="question_{{q.questionIndex}}" value="{{$index}}" v-model="q.radioSelected" lazy>
                  <label for="selection{{q.questionIndex}}_{{$index}}" name="question_{{q.questionIndex}}">{{s.content}}</label>
                </template>
                <template v-if="q.questionType === 2">
                  <input type="checkbox" id="selection{{q.questionIndex}}_{{$index}}" value='{{$index}}' v-model="s.selected">
                  <label for="selection{{q.questionIndex}}_{{$index}}">{{s.content}}</label>
                </template>
              </div>
              <template v-if="q.questionType === 3">
                <label for="question_{{q.questionIndex}}">回答</label>
                <input type='text' id="question_{{q.questionIndex}}" class="materialize-textarea" v-model="q.effectiveText">
              </template>
            </div>
          </div>
        </div>
      </div>
      <div class="divider"></div>
      <div class="commitContainer">
        <a class="btn" v-link="{path: '/'}" @click='commit(tmpActiveQ)'>提交问卷</a>
      </div>
    </div>
  </div>
</template>

<script>
import { updateQ } from '../../vuex/actions.js'
export default {
  data () {
    return {
      tmpActiveQ : {}
    }
  },
  vuex: {
    getters: {
      activeQ: state => state.activeQ
    },
    actions: {
      updateQ
    }

  },
  computed: {},
  ready () {

  },
  attached () {
    this.tmpActiveQ = this.formatData( this.activeQ )
  },
  methods: {
    formatData: function(vueObj) {
      return JSON.parse(JSON.stringify(vueObj))
    },
    validator: function(activeQ){
      // 传入的参数是 格式化 后的问卷数据
      for(var i = 0, len = activeQ.questionList.length; i < len ; i++) {
        var tmpQuestionList = activeQ.questionList;
        var missedQuestions = [];
        if( tmpQuestionList[i].questionType != 3 || tmpQuestionList[i].effectiveText.length != 0)  {  // 非文本题
           break;
        } else {
          missedQuestions.push(i+1)

        }
      }
      return missedQuestions;
    },
    trim: function(str) {
      return str.replace(/^\s+|\s$/g,'')
    },
    commit: function(activeQ) {
      // 提交分为两部分：
      // 数据统计
      // 填写有关内容清0

      // 数据统计
      // 单选题： 获取元素的radioSelected属性，将对应selectionList的元素中selectCount + 1  ，radioSelected赋值空串
      // 多选题： 获取元素每个选项的selected属性，true则selectCount + 1， 然后赋值空串
      // 文字题： 获取题目的 effectiveText属性，然后判断回答是否有效，有效则effectTextCount + 1， 然后赋值空串


      var missedQuestions = this.validator(this.tmpActiveQ)
      if(missedQuestions.length) {   // 存在 未填 文字题
          alert('请将问卷填写完整')
      } else {  // 统计阶段

          var tmpQuestionList = this.formatData(this.tmpActiveQ).questionList;


          for(var i = 0, len = tmpQuestionList.length; i < len ; i++) {

            switch(tmpQuestionList[i].questionType) {
              case 1 : {  // 单选

                tmpQuestionList[i].selectionList[tmpQuestionList[i].radioSelected].selectCount++  // radioSelected保存选中选项下标

                tmpQuestionList[i].radioSelected = ''   // reset

                break
              }
              case 2: {  // 多选
                var tmpSelectList = tmpQuestionList[i].selectionList;

                for(var j = 0, leng = tmpSelectList.length ; j < leng ; j++) {
                  if(tmpSelectList[j].selected) {

                    tmpSelectList[j].selectCount +=  tmpSelectList[j].selected   // 布尔 + 数字   布尔被转化为 数字 ( 0 或 1)
                  }
                  tmpSelectList[j].selected = ''   // reset
                }

                tmpQuestionList[i].selectionList = tmpSelectList   // 将修改后的选项数组赋值给题目数组

                break;
              }
              case 3: {

                var inputTxt = tmpQuestionList[i].effectiveText
                if(this.trim(inputTxt)) {
                  tmpQuestionList[i].effectiveTextNum++
                }
                tmpQuestionList[i].effectiveText = ''
                break;
              }
              default: {
                alert('未知错误')
              }
            }
          }

          this.tmpActiveQ.questionList = tmpQuestionList
          // 更新
          // alert(this.tmpActiveQ.Qid)
          this.updateQ(this.formatData(this.tmpActiveQ))

      }

    }
  },
  components: {}
}
</script>

<style lang="css">
</style>
