<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

</script>

<template>
  <v-layout class="app rounded rounded-md">
    <v-app-bar>
      <template v-slot:prepend>
        <v-btn icon="mdi mdi-home" @click="router.push('/')" />
        <v-btn @click="router.push({ name: 'Sabotage' })">Game 1</v-btn>
        <v-btn @click="router.push({ name: 'Finale' })">Game 2</v-btn>
      </template>
    </v-app-bar>
    <v-main >
      <router-view />
    </v-main>
  </v-layout>
</template>

<style>
#app {
  width: 100vw;
  max-width: 100vw;
}
</style>
