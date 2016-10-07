
function formatData(vueObj) {
  return JSON.parse(JSON.stringify(vueObj))
}

function dateValidator(Q) {
  var reg = /^\d+-\d+-\d+$/;
  if( reg.test( formatData(Q).deadline ) && new Date( formatData(Q).deadline) > new Date() ) {
    return true;
  } else {
    alert('时间错误，例:2016-2-2');
    return false;
  }
}

export const setActiveQ = function({dispatch},Q ) {
  dispatch('SET_ACTIVE_Q',Q)

};
// saveQ 二参：
// true 表发布
// false 表保存
export const saveQ = ({dispatch},Q,bool) => {   // Boolean 表保存(0)或发布(1)
    if(bool) {
    // 发布时间迟于当前时间，允许发布，否则报错
      alert('开始保存')
      if( dateValidator(Q) ) {
        Q.state = 2;
        localStorage.setItem('Qlist',JSON.stringify(JSON.parse(localStorage.getItem('Qlist')).push(Q)))
        dispatch('NEW_Q',Q)
      }
  } else {
    Q.state = 1;
    localStorage.setItem('Qlist',JSON.stringify(JSON.parse(localStorage.getItem('Qlist')).push(Q)))
    dispatch('NEW_Q',Q)
  }
};

export const updateQ = ({dispatch},Q) => {
    dispatch('UPDATE_Q',Q)
};

export const deleteQ = ({dispatch},Q) => {
    dispatch('DELETE_Q',Q)
};

export const deleteQs = ({dispatch},QsId) => {
    dispatch('DELETE_QS',QsId)
}

export const updateQlist = ({dispatch},newQlist) => {
    dispatch('UPDATE_QLIST',newQlist)
}
