<script setup lang="ts">
// eslint-disable-next-line no-undef
const context = useLocalStorage('context', null);
</script>

<template>
  {{ JSON.parse(context) }}
</template>
