<script setup lang="ts">

import { useI18n } from 'vue-i18n';

const { t } = useI18n();
// eslint-disable-next-line no-undef
const context = useLocalStorage<Record<string, any>>('context', null);

const menus = [{
  label: 'home',
  key: '/',
}];
if (context.value) {
  menus.push({
    label: '个人中心',
    key: '/user',
  });
}
const activeMenuKey = ref(['/']);
// eslint-disable-next-line no-undef
const router = useRouter();
const activeMenuChange = ({ key }: {key: string}) => {
  router.push(key);
};
</script>

<template>
  <a-menu
    class="cp-header__menus"
    v-model:selected-keys="activeMenuKey"
    mode="horizontal"
    @click="activeMenuChange"
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
