<template>
  <div>
    <nav-bar></nav-bar>
    <router-view></router-view>
  </div>
</template>

<script>
    import navBar from './components/navbar.vue'
    import store from '../vuex/store.js'

    //根组件加入store，子组件和store连接,从而将store注入子组件
    export default {
        components: {
            'navBar': navBar
        },
        store
    }
</script>

<style>
    html,
    body {
        height: 100%;
    }
    .page-wrapper {
        background-color: #efefef;
        height: 100%;
    }
</style>
