<script setup lang="ts">
import AppHeader from './views/layout/header.vue';
</script>

<template>
  <a-layout>
    <a-layout-header
      class="cp-header px-40"
    >
      <AppHeader />
    </a-layout-header>
    <a-layout-content>
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
  background-color var(--cp-header-bg, #fff)
</style>
