<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import AppLoginModal from '~/components/login.vue';
import { BookmarksStore, userStore } from '~/store';
import { debounce } from 'lodash-es';
import { Modal } from 'ant-design-vue';
import AppMenus from './menus/menus.vue';

const { t, locale } = useI18n();
const searchValue = ref('');
const loginVisible = ref(false);
const languageOptions = [{
  value: 'zh-CN',
  label: '中文',
}, {
  value: 'en',
  label: 'English',
}];
// eslint-disable-next-line no-undef
const { getUserInfo } = storeToRefs(userStore());
const { resetUserInfo } = userStore();
const { getBookmarks, getCategories } = BookmarksStore();

const onLanguageChange = (lang: string) => {
  locale.value = lang;
};

const openLoginPanel = () => {
  loginVisible.value = true;
};

const searchBookmarks = debounce(() => {
  getBookmarks(searchValue.value);
  getCategories(searchValue.value);
}, 200);

const exitLogin = () => {
  Modal.confirm({
    title: '退出登录',
    content: '您确认退出登录吗?',
    onOk: () => resetUserInfo(),
    okText: '确认',
    cancelText: '取消',
  });
};
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
    <a-select
      v-model:value="locale"
      @change="onLanguageChange"
      style="width: 80px"
      :options="languageOptions"
    />
    <a-dropdown :trigger="['click']">
      <a-avatar
        class="!ml-3 cursor-pointer"
        v-if="getUserInfo"
      >
        {{ getUserInfo.nickname || getUserInfo.name }}
        <template #icon>
          <i-ant-design-user-outlined
            style="height: 32px;"
            v-if="!getUserInfo?.nickname && !getUserInfo?.name"
          />
        </template>
      </a-avatar>
      <template #overlay>
        <a-menu>
          <a-menu-item
            @click="exitLogin"
            key="quit"
          >
            退出登录
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
  <AppLoginModal v-model:visible="loginVisible" />
</template>

<style scoped lang="stylus">
+block(header)
  +element(search)
    width 220px
</style>
