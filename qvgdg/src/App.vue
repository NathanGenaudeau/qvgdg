<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

</script>

<template>
  <v-layout class="app rounded rounded-md">
    <v-app-bar>
      <template v-slot:prepend>
        <v-btn icon="mdi mdi-home" @click="router.push('/')" />
        <v-btn @click="router.push('/game1')">Game 1</v-btn>
        <v-btn @click="router.push('/game2')">Game 2</v-btn>
      </template>
    </v-app-bar>
  </v-layout>
  <router-view />

</template>

<style scoped>
</style>
