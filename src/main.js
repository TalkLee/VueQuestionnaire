import Vue from 'vue'
import Router from 'vue-router'


import App from './App.vue'

import Qlist from './components/list.vue'
import newQ from './components/newQ.vue'
import displayC from './components/displayContent.vue'
import displayD from './components/displayData.vue'
import answer from './components/answer.vue'
import edit from './components/edit.vue'


Vue.use(Router);



Vue.config.debug = true;
Vue.config.devtools = true;

var router = new Router();

router.map({
  '/': {
    // 问卷列表页
    component: Qlist
  },
  // 新建问卷
  '/newQ': {
    component: newQ
  },
  // 展示内容
  '/displayContent/:Qindex': {
    component: displayC
  },
  '/edit/:Qindex': {
    component: edit
  },
  // 展示数据
  '/displayData/:Qindex': {
    component: displayD
  },
  // 回答问卷
  '/answer/:Qindex': {
    component: answer
  }
});

router.redirect({
  '*': '/'
});

router.beforeEach(function () {
  window.scrollTo(0, 0)
});


router.start(App, '#app');
