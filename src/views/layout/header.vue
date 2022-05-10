<script setup lang="ts">
import AppMenus from '~/components/menus/menus.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const searchValue = ref('');
</script>

<template>
  <AppMenus />
  <div>
    <a-input
      class="cp-header__search"
      v-model="searchValue"
      :placeholder="t('internalSearch')"
    >
      <template #suffix>
        <i-ant-design-search-outlined />
      </template>
    </a-input>
    <a>{{ t('login') }}</a>
    |
    <a>{{ t('register') }}</a>
  </div>
</template>

<style scoped lang="stylus">
+block(header)
  +element(search)
    width 220px
</style>
