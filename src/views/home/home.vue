<script setup lang="ts">
import { userStore } from '~/store';
import AppBanner from './banner.vue';
import AppCategories from './categories/categories.vue';

const { getUserInfo } = storeToRefs(userStore());
</script>

<template>
  <AppBanner />
  <div
    v-if="getUserInfo"
    class="cp-home__content"
  >
    <AppCategories />
  </div>
</template>
