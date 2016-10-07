
import Vue from 'vue'
import Vuex from 'vuex'

function formatData(vueObj) {
  return JSON.parse(JSON.stringify(vueObj))
}


// 所有组件均使用相同的store，故不分模块编写
const state = {
    Qlist: [],
    activeQ: {}
};

const mutations = {
    SET_ACTIVE_Q(state,Q) {
        state.activeQ = Q
    },
    // 回答以及编辑问卷后，
    // 提交均需更新问卷信息
    UPDATE_Q(state,Q) {
        // 查找对应问卷对象，覆盖写入
        // 遍历判断index?
        var index;
        for(var i = 0 , len = state.Qlist.length ; i < len; i++) {
          alert(state.Qlist[i].Qid)
          if(state.Qlist[i].Qid === Q.Qid) {
            index = i;
            break;
          }
        }
        state.Qlist[i] = Q
        window.localStorage.setItem('Qlist',JSON.stringify(formatData( state.Qlist )) );
    },
    // 新建问卷提交时，返回问卷对象写入state中
    
    NEW_Q(state,Q) {
      alert('NEW_Q');
      alert(state.Qlist.length)
      alert(Q)
      state.Qlist.$set(state.Qlist.length,formatData(Q) );
    },
    // 列表页对问卷进行删除操作后，更新列表页
    UPDATE_QLIST(state,newQlist) {
      state.Qlist = newQlist
      alert(state.Qlist)
      //window.localStorage.setItem('Qlist',JSON.stringify( newQlist ) )
    }
};



export default new Vuex.Store({
    state,
    mutations
});
