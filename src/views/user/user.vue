<script setup lang="ts">
import { userStore } from '~/store';

const { getUserInfo } = storeToRefs(userStore());
</script>

<template>
  {{ getUserInfo }}
</template>
