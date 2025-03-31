<script setup lang="ts">
import { ref, watch } from 'vue';

import { Player } from '../types/Player';

const players = ref<Player[]>(localStorage.getItem('players') ? JSON.parse(localStorage.getItem('players')!) : []);

const colors = ref<string[]>(['red-darken-4', 'light-blue', 'green', 'yellow-darken-4', 'deep-purple-darken-2'].sort(() => Math.random() - 0.5));

const themes = ref<string[]>(['theme 1', 'theme 2', 'theme 3', 'theme 4']);
const disabledButtons = ref<number[]>([]);

const choseTheme = (index: number) => {

  disabledButtons.value.push(index);
};

watch(players, (newPlayers: Player[]) => {
  localStorage.setItem('players', JSON.stringify(newPlayers));
}, { deep: true });
</script>

<template>
  <v-container>
    <v-row>
      <v-col v-for="(player, index) in players.filter((player: Player) => player.isVisible)" :key="index">
        <v-card class="pa-4">
          <v-avatar class="player-avatar" size="xx-large" :icon="`mdi-alpha-${player.name.charAt(0).toLowerCase()}-circle`" :color="colors[index]"/>
          <v-card-title>
            <div class="text-h4 font-weight-bold pt-1 pb-6">{{ player.name }}</div>
            <v-btn-toggle v-model="player.score2" divided>
              <v-btn v-for="score in [0, 1, 2, 3, 4]" :value="score" color="green">{{ score }}</v-btn>
            </v-btn-toggle>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="themes mt-16">
      <v-btn v-for="(theme, index) in themes" :key="index" 
        @click="choseTheme(index)"
        :disabled="disabledButtons.includes(index)"
        size="x-large" variant="outlined" class="mx-4"
      >
        {{ index !== 3 ? theme : 'Thème mystère' }}
      </v-btn>
    </v-row>   
  </v-container>
</template>

<style scoped>

.player-avatar {
  font-size: 100px;
}

.themes {
  display: inline-block;
}
</style>
