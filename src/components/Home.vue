<script setup lang="ts">

const emit = defineEmits(['openNavigationDrawer']);

const openNavigationDrawer = () => {
  emit('openNavigationDrawer');
};

</script>

<template>
  <h1>Le Quiz Des Champi(gn)ons</h1>
  <v-btn @click="openNavigationDrawer" size="x-large" color="primary" class="mt-8">Configurez les participants</v-btn>
</template>

<style scoped>
</style>
