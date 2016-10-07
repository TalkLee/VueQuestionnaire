<!--
    删除问卷，
    this.$remove()
    多选删除:
    获取selectedQ 数组元素，然后删除对应索引的state即可

 -->
<template lang="html">
    <div class="container z-depth-2 Qlist" >
          <div class="section">
            <table class='bordered centered'>
              <thead>
                <tr>
                  <th>问卷名称</th>
                  <th>截止日期</th>
                  <th>状态</th>
                  <th>
                    <a class='btn waves-effect wave-light' v-link="{path: '/newQ'}">新建问卷</a>
                    <a class='btn waves-effect wave-light' @click="pageDeleteQs(selectedQs)">删除问卷</a>
                  </th>
                </tr>
              </thead>
              <tbody>
                <!--循环问卷列表 -->
                <tr v-for="Q in Qs">
                  <td>
                    <input type="checkbox" name="name" value="{{$index}}" id="Q_{{$index}}" v-model="selectedQs">
                    <label for="Q_{{$index}}">{{Q.title}}</label>
                  </td>
                  <td>{{Q.deadline}}</td>
                  <td>
                    {{ transformState(Q.state) }}
                  </td>
                    <template v-if=" Q.state ==  3  && new Date( Q.deadline ) < new Date() ">
                      <td>
                        <a class='btn' data-type='$index' @click="pageDeleteQ(Q)">删除</a>
                        <a class="btn" v-link="{path: '/displayContent/' + $index   }" @click="setActiveQ(Q)">查看问卷</a>
                        <a class='btn' v-link="{path: '/displayData/'  + $index  }" @click="setActiveQ(Q)">查看数据</a>
                      </td>
                    </template>
                    <template v-if=" Q.state ==  2 && new Date( Q.deadline ) > new Date()">
                      <td>
                        <a class='btn' data-type='$index' @click="pageDeleteQ(Q)">删除</a>
                        <a class="btn" v-link="{path: '/displayContent/' + $index   }" @click="setActiveQ(Q)">查看问卷</a>
                        <a class="btn" v-link="{path: '/answer/' + $index   }" @click="setActiveQ(Q)">回答问卷</a>
                        <a class='btn' v-link="{path: '/displayData/'  + $index  }" @click="setActiveQ(Q)">查看数据</a>
                      </td>
                    </template>
                  <template v-if=" Q.state ==  1 && new Date( Q.deadline ) > new Date()" >
                    <td>
                      <a class='btn' data-type='$index' @click="pageDeleteQ(Q)">删除</a>
                      <a class='btn' v-link="{path : '/edit/' + $index }" @click="setActiveQ(Q)">编辑</a>
                      <a class='btn' v-link="{path: '/displayData/' + $index   }" @click="setActiveQ(Q)">查看数据</a>
                    </td>
                  </template>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
</template>

<script>
// 生成一个伪id
function getId() {
  return Math.random()* 100000000000000000
}
import {
  setActiveQ, deleteQ,deleteQs,updateQlist
} from '../../vuex/actions.js'
var defaultData = [{
  Qid: getId(),
  title: "关于考研的调查问卷",
  description: "考研的确是一件关系到大学生前程的事情，但是同学们也没必要考虑得太早了，从大三开始考虑完全来得及，考虑太早，最后变化也快，这个时代节奏太快，计划赶不上变化，等到大三了，学业各方面都差不多稳定了，这时候再考虑，对自己未来的定位会更准确。究竟该不该考研?该考哪个学校?一些人甚至从大一大二就开始考虑这个问题，确实对于这个大的问题，是否做，如何做，多花些时间来考虑是必要的。但在开始考虑这个问题时，你首先要知道的是考研的整个流程，它要经过哪些阶段，在什么时间要做什么事情，这些都要心中有数，以便及早安排，计划周详。考研大致要经过以下过程。",
  state: 2,
  deadline: "2016-11-1",
  num: 0, //填写人数
  questionList: [{
    required: true,
    questionType: 1,
    questionIndex: 1,
    caption: "您的年龄",
    radioSelected: '',
    selectionList: [{
      selectionIndex: 1,
      content: "18岁以下",
      selectCount: 0,
    }, {
      selectionIndex: 2,
      content: "18-25",
      selectCount: 0,
    }, {
      selectionIndex: 3,
      content: "25-35",
      selectCount: 0
    }, {
      selectionIndex: 4,
      content: "35-50",
      selectCount: 0
    }, {
      selectionIndex: 5,
      content: "50岁以上",
      selectCount: 0
    }]
  }, {
    required: false,
    questionType: 2,
    questionIndex: 2,
    caption: "您的爱好",
    selectionList: [{
      selectionIndex: 1,
      content: "音乐",
      selectCount: 0,
      selected: ''
    }, {
      selectionIndex: 2,
      content: "阅读",
      selectCount: 0,
      selected: ''
    }, {
      selectionIndex: 3,
      content: "旅游",
      selectCount: 0,
      selected: ''
    }, {
      selectionIndex: 4,
      content: "电影",
      selectCount: 0,
      selected: ''
    }]
  }, {
    required: true,
    questionType: 3,
    questionIndex: 3,
    caption: "您的职业是?",
    selectionList: [],
    effectiveTextNum: 0,
    effectiveText: ''
  }]
}, {
  Qid: getId(),
  title: "关于本天才的调查问卷",
  description: "本天才才不是傻逼",
  state: 1,
  deadline: "2016-11-6",
  num: 128, //填写人数
  questionList: [{
    required: true,
    questionType: 1,
    caption: "您的偶像",
    questionIndex: 1,
    radioSelected: '',
    selectionList: [{
      selectionIndex: 1,
      content: "自己",
      selectCount: 1
    }, {
      selectionIndex: 2,
      content: "没有偶像",
      selectCount: 2
    }, {
      selectionIndex: 3,
      content: "关你屁事",
      selectCount: 2
    }]
  }, {
    required: false,
    questionType: 2,
    caption: "您觉得自己的标签",
    questionIndex: 2,
    selectionList: [{
      selectionIndex: 1,
      content: "智商很感人",
      selectCount: 1,
      selected: ''
    }, {
      selectionIndex: 2,
      content: "智商非常感人",
      selectCount: 2,
      selected: ''
    }, {
      selectionIndex: 3,
      content: "傻逼一个",
      selectCount: 2,
      selected: ''
    }, {
      selectionIndex: 4,
      content: "哦",
      selectCount: 2,
      selected: ''
    }]
  }, {
    required: true,
    questionType: 3,
    questionIndex: 3,
    caption: "您的职业是?",
    selectionList: [],
    effectiveTextNum: 0
  }]
}];
export default {
  data() {
    return {
      Qs: [],
      selectedQs: []    // 删除时选中的问卷索引
    }
  },
  computed: {},
  ready() {
  },
  events: {
  },
  vuex: {
    getters: {
      QList: state => state.Qlist
    },
    actions: {
      setActiveQ,
      deleteQ,
      deleteQs,
      updateQlist
    }
  },
  methods: {
    formatData: function(vueObj) {
      return JSON.parse(JSON.stringify(vueObj))
    },
    transformState: function(state) {
      switch (state) {
        case 1:
          return '未发布';
        case 2:
          return '进行中';
        case 3:
          return '已结束';
      }
    },
    pageDeleteQ: function(Q) {
      var Qindex;
      this.Qs.forEach(function(currentValue,index,array) {  //查找ID相等的问卷
          if(currentValue.Qid == Q.Qid) {
            Qindex = index
          }
      })
      this.Qs.splice(Qindex,1)
      window.localStorage.setItem('Qlist',JSON.stringify(this.formatData(this.Qs)))
    },
    pageDeleteQs: function(QsId) {
      QsId.forEach(function(Qid,index,array) {
        var index = this.Qs.forEach(function(currentQ,index,array) {
            if(currentQ.Qid == Qid) {
              return index
            }
        },this)
        this.Qs.splice(index)
      },this)
      window.localStorage.setItem('Qlist',JSON.stringify(this.formatData(this.Qs)))
    }
  },

  attached() {
    // 判断应用是否是初始状态

    if( this.formatData(this.QList).length ) {
      //alert('state中存有数据')
      this.Qs = this.QList
      // 获取localStorage保存的问卷信息
    } else if ( JSON.parse( window.localStorage.getItem('Qlist') ) instanceof Array) {
      //alert('localStorage中存有数据')
      // 预置vuex state中Qlist属性
      this.Qs = JSON.parse(window.localStorage.getItem('Qlist'));
      this.updateQlist(JSON.parse(window.localStorage.getItem('Qlist')));
    } else {   // 获取默认数据
      //works\alert('初始状态')
      localStorage.clear();
      window.localStorage.setItem('Qlist', JSON.stringify(defaultData));
      this.Qs= defaultData;
      this.updateQlist(JSON.parse(window.localStorage.getItem('Qlist')));
    }
  },

}


</script>

<style lang="css" >
  .Qlist{
    margin:100px auto;
    background-color:#FFF;
  }
</style>


<!-- router-view切换前后组件不是父子 -->
