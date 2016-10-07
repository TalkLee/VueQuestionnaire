<template lang="html">
  <div class="container">
    <div class="section">
      <h4 class="center-align">{{tmpActiveQ.title}}</h4>
      <h6 class='center-align'>{{tmpActiveQ.description}}</h6>
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
                <textarea id="{{q._id}}" class="materialize-textarea"></textarea>
              </template>
            </div>
          </div>
        </div>
      </div>
        <div class="addQuestion">
          <div id="questionTypeChoices" class="row">
            <span class="btn col m2 offset-m2" id='radioQuestion' @click='createQuestion(1)'>单选题</span>
            <span class="btn col m2 offset-m1" id='checkboxQuestion' @click='createQuestion(2)'>多选题</span>
            <span class="btn col m2 offset-m1" id='textQuestion' @click='createQuestion(3)'>文字题</span>
          </div>
          <div class="valign-wrapper addQuestionBtn @click='displayToggle('#questionTypeChoices')'">
          <strong>+</strong> 添加问题
        </div>
        </div>
        <span class="timeSetting">
            <label for="timepicker">问卷截止日期</label>
            <input type="text" id="timepicker" >
        </span>
        <span class='btn' @click='saveQ(Q,false)'>保存问卷</span>
        <span class='btn' @click='saveQ(Q,true)'>回答问卷</span>
    </div>
  </div>
</template>

<script>
import {
  saveQ
} from '../../vuex/actions.js'
export default {
  data() {
    return {
      tmpInputShow: false,
      selectionCounter: 1,
      tmpActiveQ: {}
    }
  },
  vuex: {
    getters: {
      activeQ: state => state.activeQ
    },
    actions: {
      saveQ
    }
  },
  computed: {},
  attached() {
    this.tmpActiveQ = this.activeQ
  },
  methods: {
    editClassName: function(ele, str, bool) {
      var classArr = ele.className.split(/ /);
      console.log("修改前" + classArr)

      var newClass;
      if (bool) { // 删除
        newClass = (classArr.indexOf(str) + 1) ? (classArr.splice(classArr.indexOf(str), Number(bool)), classArr.join(' ')) : classArr;
        console.log(newClass)
      } else { // 添加

        newClass = (classArr.indexOf(str) + 1) ? classArr : (classArr.push(str), classArr.join(' '));
        console.log("修改后" + newClass)
      }
      ele.className = newClass;
    },
    // 将vue中添加了getter 和 setter 方法的对象 转化为 普通对象
    formatData: function(vueObj) {
      return JSON.parse(JSON.stringify(vueObj))
    },

    parseDOM: function(str) {
      var obj = document.createElement('div');
      obj.innerHTML = str;
      return obj.childNodes;
    },
    // 编辑内容,待重写

    // 创建选项,供createQuestion调用
    createSelection: function(num) {
      var newSelectionList = []
      for (var i = 0; i < num; i++) {
        newSelectionList.push({
          selectionIndex: this.selectionCounter,
          content: '选项' + this.selectionCounter,
          selectCount: 0
        });
        this.selectionCounter++
      }
      this.$set('selectionCounter', 1)
      return newSelectionList
    },
    createQuestion: function(type) {
      var newSelectionList = []
      const defaultOptionNum = 4;
      switch (type) {
        case 1:
          {
            newSelectionList = this.createSelection(defaultOptionNum)
            this.activeQ.questionList.push({
              questionType: 1,
              caption: '单选题',
              questionIndex: this.questionCounter++,
              effectiveTextNum: 0,
              // createSelection返回生成的选项列表
              selectionList: newSelectionList
            })
            break
          }
        case 2:
          {
            newSelectionList = this.createSelection(defaultOptionNum)
            this.activeQ.questionList.push({
              questionType: 2,
              caption: '多选题',
              questionIndex: this.questionCounter++,
              effectiveTextNum: 0,
              selectionList: newSelectionList
            })
            break
          }
        case 3:
          {
            this.activeQ.questionList.push({
              questionType: 3,
              caption: '文字题',
              questionIndex: this.questionCounter++,
              effectiveTextNum: 0,
              selectionList: []
            })
            break
          }
      }
    },

    setLocation: function(ele, rect) {
      ele.style.position = 'absolute';
      ele.style.left = rect.left + window.pageXOffset + 'px'
      ele.style.top = rect.top + window.pageYOffset + 'px'
      ele.style.width = rect.width + 'px'
      ele.style.height = rect.height + 'px'
    },

    edit: function(event) {
      // getBoundingClientRect获取元素位置（相对视口)大小信息 ,返回一个DOMRect对象
      // 还需要加上滚动高度

      // 1. 获取元素位置大小
      // 2. 给正在编辑元素做标记，用于之后将编辑文字赋值给元素
      // 3. 隐藏元素 hidden
      // 4. 显示临时输入框,设置位置
      // 5. 临时输入框输入完毕，触发回车或者失去焦点事件
      // 6. 临时输入框值赋值给正在编辑元素

      var target = event.target;

      var rect = target.getBoundingClientRect();



      this.editClassName(target, 'editing', false);

      target.style.visibility = 'hidden'

      this.tmpInputShow = true
      this.setLocation(this.$els.input, rect);



    },
    // 5. 临时输入框输入完毕，触发回车或者失去焦点事件
    // 6. 临时输入框值赋值给正在编辑元素
    finishModify: function(event) {

      if (document.getElementsByClassName('editing')[0]) {

        document.getElementsByClassName('editing')[0].innerHTML = event.target.value
        document.getElementsByClassName('editing')[0].style.visibility = 'visible';

        this.tmpInputShow = false // 临时输入框消失
        this.$els.input.value = ''
        this.editClassName(document.getElementsByClassName('editing')[0], 'editing', true) // 删除自定义元素添加的editing类名

      }
    },

        moveUpq: function(q,index) {
          console.log(this.newQ)
          var tmpQuestionList = this.newQ.questionList
          var temp = formatData( tmpQuestionList[index-1] )  // 临时保存前一个元素
          tmpQuestionList[index-1] = q // 当前元素赋值给前一个
          tmpQuestionList[index] = temp
          this.newQ.questionList = tmpQuestionList
          console.log(this.newQ)

        },
        moveDownq: function(q,index) {
          console.log(this.newQ)
          var tmpQuestionList = this.newQ.questionList
          var temp = formatData( tmpQuestionList[index+1] )  // 临时保存前一个元素
          tmpQuestionList[index+1] = q // 当前元素赋值给前一个
          tmpQuestionList[index] = temp
          this.newQ.questionList = tmpQuestionList
          console.log(tmpQuestionList)

        },
        copyq: function(q,index) {
          // 复制当前题目到当前题目后一位置
          // 若题目不为第一个和最后一个，需要先将后面的元素删除，该题目后插入相同题目，然后将之前删除元素再加入数组
          console.log(this.newQ)
          var oddEles = this.newQ.questionList.slice(index)
          // 不包括末尾元素
          var beginEles = this.newQ.questionList.slice(0,index)
          this.newQ.questionList = beginElesEles.concat(q,oddEles)
          console.log(this.newQ.questionList)
        },
        deleteq: function(q,index) {
          // 删除元素, splice
          console.log(this.newQ.questionList)
          // 不包括当前待删除元素
          var oddEles = this.newQ.questionList.slice(index+1)
          // 不包括末尾元素
          var beginEles = this.newQ.questionList.slice(0,index)
          this.newQ.questionList = beginElesEles.concat(oddEles)
          console.log(this.newQ.questionList)
        }
  },
  components: {}
}
</script>

<style lang="css">
</style>
