<script setup lang="ts">

import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const menus = [{
  label: 'home',
  key: '/',
}];
const activeMenuKey = ref(['/']);
</script>

<template>
  <a-menu
    class="cp-header__menus"
    v-model:selected-keys="activeMenuKey"
    mode="horizontal"
  >
    <a-menu-item
      v-for="item in menus"
      :key="item.key"
    >
      {{ t(item.label) }}
    </a-menu-item>
  </a-menu>
</template>

<style lang="stylus">
+block(header)
  +element(menus)
    flex 1 !important
</style>
