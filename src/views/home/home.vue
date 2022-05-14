<template>
  <AppBanner />
  <div>{{ t('currentLanguage') }}: {{ locale }}</div>
  <button @click="toggleLanguage">
    {{ t('toggleLanguage') }}
  </button>
  <br>
  <button @click="toggleTheme">
    {{ t('toggleTheme') }}
  </button>
  <br>
  <button @click="getUserInfo">
    {{ t('getUserInfo') }}
  </button>
  <br>
  <p>{{ userInfo }}</p>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Theme } from '@compass-aiden/utils';
import { getUserInfoById, getUsers } from '~/http';
import AppBanner from './banner.vue';

const { locale, t } = useI18n();
const theme = inject<Theme>('Theme');

function toggleLanguage() {
  locale.value = locale.value === 'en' ? 'zh-CN' : 'en';
}

const userInfo = ref('');

getUsers().subscribe((result) => {
  console.log('users: ', result);
});

function toggleTheme() {
  if (!theme) return;
  if (theme.getCurrentTheme() === 'light') {
    theme.toggleTheme('dark');
  } else {
    theme.toggleTheme('light');
  }
}

function getUserInfo() {
  getUserInfoById(1)
    // 返回的 cancel 方法可以用来主动取消请求
    .subscribe(
      (result: any) => {
        console.warn(result);
        userInfo.value = JSON.stringify(result);
      },
      () => {},
    );
}
</script>
