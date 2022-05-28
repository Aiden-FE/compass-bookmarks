<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Theme } from '@compass-aiden/utils';
import AppLoginModal from '~/components/login.vue';
import { BookmarksStore, userStore } from '~/store';
import { debounce } from 'lodash-es';
import AppMenus from './menus/menus.vue';

const theme = inject<Theme>('Theme');
const { t, locale } = useI18n();
const searchValue = ref('');
const loginVisible = ref(false);
const isLightTheme = ref(theme?.getCurrentTheme() === 'light');
const languageOptions = [{
  value: 'zh-CN',
  label: '中文',
}, {
  value: 'en',
  label: 'English',
}];
// eslint-disable-next-line no-undef
const { getUserInfo } = storeToRefs(userStore());
const { getBookmarks } = BookmarksStore();

const onLanguageChange = (lang: string) => {
  locale.value = lang;
};

const toggleTheme = (isLight: boolean) => {
  if (!theme) return;
  isLightTheme.value = isLight;
  theme.toggleTheme(isLight ? 'light' : 'dark');
};

const openLoginPanel = () => {
  loginVisible.value = true;
};

const searchBookmarks = debounce(() => {
  getBookmarks(searchValue.value);
}, 200);
</script>

<template>
  <img
    alt="logo"
    width="200"
    src="https://compass-aiden.oss-cn-shanghai.aliyuncs.com/bookmarks/compass-bookmarks-logo-xinhuamozhu.jpg"
  >
  <AppMenus />
  <div class="flex items-center">
    <a-input
      class="cp-header__search mx-3"
      v-model:value="searchValue"
      @pressEnter="searchBookmarks"
      :placeholder="t('internalSearch')"
    >
      <template #suffix>
        <i-ant-design-search-outlined />
      </template>
    </a-input>
    <div v-if="!getUserInfo">
      <a
        @click="openLoginPanel"
        @keydown="openLoginPanel"
      >{{ t('login') }}</a>
      |
      <a>{{ t('register') }}</a>
    </div>
    <a-switch
      class="!mx-3"
      :checked="isLightTheme"
      @change="toggleTheme"
      :checked-children="t('defaultTheme')"
      :un-checked-children="t('darkTheme')"
    />
    <a-select
      v-model:value="locale"
      @change="onLanguageChange"
      style="width: 80px"
      :options="languageOptions"
    />
  </div>
  <AppLoginModal v-model:visible="loginVisible" />
</template>

<style scoped lang="stylus">
+block(header)
  +element(search)
    width 220px
</style>
