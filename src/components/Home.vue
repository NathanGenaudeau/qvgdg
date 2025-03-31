<script setup lang="ts">

const emit = defineEmits(['openNavigationDrawer']);

const openNavigationDrawer = () => {
  emit('openNavigationDrawer');
};

</script>

<template>
  <h1>Le Quiz Des Champi(gn)ons</h1>
  <v-btn @click="openNavigationDrawer" size="x-large" color="#303D97" class="mt-8">Configurez les participants</v-btn>
  <br/>
  <v-btn @click="$router.push('manche1')" size="x-large" color="#978a30" class="mt-4">Commencer</v-btn>
</template>