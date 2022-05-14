<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const tabsData = [{
  value: 'baidu',
  label: 'baidu',
}, {
  value: 'google',
  label: 'google',
}];

const { t } = useI18n();
const searchType = ref<'baidu' | 'google'>('baidu');
const keyword = ref('');

const onSearch = (keywordText: string) => {
  switch (searchType.value) {
    case 'baidu':
      window.open(`https://www.baidu.com/s?wd=${keywordText}`);
      break;
    case 'google':
      window.open(`https://www.google.com/search?q=${keywordText}`);
      break;
    default:
      throw new Error('不支持的搜索类型');
  }
};
</script>

<template>
  <div class="cp-home__banner p-20 px-40 bg-gradient-to-r from-green-500/50 to-blue-500">
    <a-tabs
      v-model:activeKey="searchType"
      type="card"
    >
      <a-tab-pane
        v-for="item in tabsData"
        :key="item.value"
        :tab="t(item.label)"
      />
    </a-tabs>
    <a-input-search
      v-model="keyword"
      :placeholder="t('keywordSearchPlaceholder')"
      :enter-button="t(searchType)+' '+t('search').toLocaleLowerCase()"
      size="large"
      :bordered="true"
      @search="onSearch"
    />
  </div>
</template>

<style lang="stylus">
+block(home)
  +element(banner)
    .ant-tabs > .ant-tabs-nav
      margin 0
    .ant-tabs-top > .ant-tabs-nav::before
      border 0
    .ant-input-search .ant-input-lg
      background #fff
    .ant-tabs-tab
      border 0 !important
      background transparent !important
    .ant-tabs-tab-active
      background #fff !important
</style>
