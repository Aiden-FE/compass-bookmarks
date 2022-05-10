<script setup lang="ts">
import AppHeader from './views/layout/header.vue'
</script>

<template>
  <a-layout>
    <a-layout-header
      class="cp-header"
    >
      <AppHeader />
    </a-layout-header>
    <a-layout-content style="padding: 0 50px">
      <router-view />
    </a-layout-content>
    <a-layout-footer style="text-align: center">
      Ant Design ©2018 Created by Ant UED
    </a-layout-footer>
  </a-layout>
</template>

<style scoped lang="stylus">
+block(header)
  position: 'fixed' !important
  display flex
  zIndex: 1 !important
  width: '100%' !important
  background #fff
</style>
