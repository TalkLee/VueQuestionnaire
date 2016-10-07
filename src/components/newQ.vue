<!--
  新建问卷逻辑功能：
  1. 新建问卷：
    - 内容自定义
        - 修改题目、选项内容
        - 添加题目、选项
        - 复用题目
        - 移动题目
        - 删除选项
    - 问卷的保存 发布
        - 保存到vuex的state，然后将localStorage也同步为 vuex中state中Qlist数据
        - 首页通过localStorage获取数据(localStorage中必保存最新数据)
    -

    题目的 上移下移复制删除逻辑完成，待调试

 -->

<style lang="css" >
  .addQuestion {
      border: 1px solid #bdbdbd;
      background: #FFF;
      margin: 50px auto;
      width: 90%;
  }
  .addQuestionBtn {
      display: block;
      height: 80px;
      line-height: 80px;
      color: #616161;
      text-align: center;
      background: #e0e0e0;
  }
  .divider {
      height: 3px;
      background-color: #bdbdbd;
  }
  .container {
      background-color: #FFF;
      padding: 20px;
      margin-top: 50px;
  }
  #questionTypeChoices {
      margin: 10px auto;
  }
  #alternative {
    border-bottom:none;
    margin:0;
  }
  #alternative:focus{

    boder-bottom:none;
    padding:0 5px;
    border:1px solid #26a69a;
    box-shadow:none;

  }

  .questionModify{
      display: none;
  }

</style>
<template lang="html">
  <div class="container">
      <h4 class="center-align title" @click="edit($event)" >{{newQ.title}}</h4>
      <h6 class="center-align description" @click="edit($event,'description')">{{newQ.description}}</h6>
      <div class="divider"></div>
      <div class="questionListContainer card">
          <div class="questionContainer card" v-for="q in newQ.questionList">
              <div class="card-content">
                  <div class="card-title">
                      Q{{$index + 1}}&nbsp;&nbsp;<span @click="edit($event,'caption',$index)">{{q.caption}}</span>
                  </div>
                  <span v-el:qIndex style='display:none'>{{$index}}</span>         <!-- $index保存题目索引-->
                  <div class="selectionListContainer">
                      <div class="selectionContainer" v-for="s in q.selectionList">
                          <template v-if="q.questionType === 1">
                              <input type="radio" id="selection{{q.questionIndex}}_{{s.selectionIndex}}" name="question_{{q.questionIndex}}">
                              <label for="selection{{q.questionIndex}}_{{s.selectionIndex}}" name="question_{{q.questionIndex}}" @click="edit($event,'content',this.$els.qIndex,$index)">{{s.content}}</label>
                          </template>
                          <template v-if="q.questionType === 2">
                              <input type="checkbox" id="selection{{q.questionIndex}}_{{s.selectionIndex}}">
                              <label for="selection{{q.questionIndex}}_{{s.selectionIndex}}" @click="edit($event,'content',this.$els.qIndex,$index)">{{s.content}}</label>
                          </template>
                      </div>
                      <template v-if="q.questionType === 3">
                          <label for="question_{{q.questionIndex}}">回答</label>
                          <textarea id="question_{{q.questionIndex}}" class="materialize-textarea"></textarea>
                      </template>
                  </div>
              </div>
              <div class="questionModify right-align card-action">
                <span @click='moveUpq(q,$index)'>上移</span>
                <span @click='moveDownq(q,$index)'>下移</span>
                <span @click='copyq(q,$index)'>复用</span>
                <span @click='deleteq(q,$index)'>删除</span>
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
      <div class="divider"></div>
      <span class="timeSetting">
          <label for="timepicker">问卷截止日期</label>
          <input type="text" id="timepicker" v-model='newQ.deadline'>
      </span>
      <a class='btn' @click='saveQ(newQ,false)' v-link="{path: '/'}">保存问卷</a>
      <a class='btn' @click='saveQ(newQ,true)' v-link="{path: '/'}">发布问卷</a>
      <input type='text' v-el:input id='tmpInput' v-el:tmp @blur="finishModify($event)"
       @keyup.enter="finishModify($event)"
       v-show='tmpInputShow' placeholder="自定义">
  </div>
</template>
<script>
import {
  saveQ
} from '../../vuex/actions.js'
export default {
  data() {
    return {
      selectionCounter: 1,
      questionCounter: 1,
      tmpInputShow: false,
      newQ: {
        title: '测试',
        description: '描述',
        state: 0,
        deadline: '',
        num: 0,
        questionList: []
          //  questionList内部元素数据结构
          //  {
          //    questionType:0,
          //    caption:'',
          //    questionIndex:0,
          //    effectiveTextNum:0 ,  文字题使用
          //    effectiveText: '',
          //    radioSelected: '',  单选题使用
          //    selectionList:[]
          //  }
          //  selectionList内部元素数据结构
          //  {
          //    selectionIndex : 0,
          //    content : '',
          //    selectCount : 0   多选题使用
          //  }
      }
    }
  },
  vuex: {
    actions: {
      saveQ
    }
  },
  computed: {},
  ready() {},
  attached() {},
  methods: {
    // 复用

    editClassName: function(ele, str, bool) {
      var classArr = ele.className.split(/ /);
      var newClass;
      if (bool) { // 删除
        newClass = ( classArr.indexOf(str) + 1 ) ? ( classArr.splice( classArr.indexOf(str), Number(bool) ), classArr.join(' ') ) : classArr;
      } else { // 添加
        newClass = ( classArr.indexOf(str) + 1 ) ? classArr : ( classArr.push(str) , classArr.join(' ') );
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
    createSelection: function(num,type) {
      var newSelectionList = []
      for (var i = 0; i < num; i++) {
        if(type ==  1 ) {
          newSelectionList.push({
            selectionIndex: this.selectionCounter,
            content: '选项' + this.selectionCounter
          });
        } else if( type == 2) {
          newSelectionList.push({
            selectionIndex: this.selectionCounter,
            content: '选项' + this.selectionCounter,
            selectCount: 0
          });
        }
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
            newSelectionList = this.createSelection(defaultOptionNum,1)
            this.newQ.questionList.push({
              questionType: 1,
              caption: '单选题',
              questionIndex: this.questionCounter++,
              radioSelected: '',
              // createSelection返回生成的选项列表
              selectionList: newSelectionList
            })
            break
          }
        case 2:
          {
            newSelectionList = this.createSelection(defaultOptionNum,2)
            this.newQ.questionList.push({
              questionType: 2,
              caption: '多选题',
              questionIndex: this.questionCounter++,
              selectionList: newSelectionList
            })
            break
          }
        case 3:
          {
            this.newQ.questionList.push({
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
      ele.focus()
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

      this.editClassName(target,'editing',false);

      target.style.visibility = 'hidden'

      this.tmpInputShow = true
      this.setLocation(this.$els.input, rect);

    },
    // 5. 临时输入框输入完毕，触发回车或者失去焦点事件
    // 6. 临时输入框值赋值给正在编辑元素
    finishModify: function(event) {

      if( document.getElementsByClassName('editing')[0] ) {
          // alert(document.getElementsByClassName('editing')[0].getAttribute('data-text') )
          // alert(event.target.value)
          document.getElementsByClassName('editing')[0].setAttribute('data-text',event.target.value)
          // alert(this.newQ.title);
          // alert(document.getElementsByClassName('editing')[0].getAttribute('data-text') )
          document.getElementsByClassName('editing')[0].style.visibility = 'visible';
          this.tmpInputShow = false  // 临时输入框消失
          this.$els.input.value = ''
          this.editClassName(document.getElementsByClassName('editing')[0],'editing',true) // 删除自定义元素添加的editing类名
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
