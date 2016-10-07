<template lang="html">
  <nav>
    <div class="nav-wrapper">
      <a href="#" class='brand-logo left' >?</a>
      <a href="#" class='left' v-link="{ path : '/' }">我的问卷</a>
    </div>
  </nav>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  computed: {},
  ready () {},
  attached () {},
  methods: {},
  components: {}
}
</script>

<style lang="css">
      .brand-logo{
        position: relative !important;
        width:40px;
        height:40px;
        text-align:center;
        border-radius:20px;
        background-color:red;
        line-height: 40px;
        margin:12px 50px;
      }
</style>
