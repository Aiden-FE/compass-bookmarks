<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { userStore } from '~/store';

const { t } = useI18n();
const { getUserInfo } = storeToRefs(userStore());

const menus = ref([{
  label: 'home',
  key: '/',
}]);
watchEffect(() => {
  menus.value = [{
    label: 'home',
    key: '/',
  }].concat(getUserInfo.value ? {
    label: 'userCenter',
    key: '/user',
  } : []);
});

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
