<script setup lang="ts">
import { ref, watch } from 'vue';

import { Player } from '../types/Player';

const players = ref<Player[]>(localStorage.getItem('players') ? JSON.parse(localStorage.getItem('players')!) : []);

const colors = ref<string[]>(['red-darken-4', 'light-blue', 'green', 'yellow-darken-4', 'deep-purple-darken-2'].sort(() => Math.random() - 0.5));

const currentPlayer = ref<Player | null>(null);

const addScore = (nb: number) => {
  if (!currentPlayer.value) return;
  currentPlayer.value.score += nb;
}

watch(players, (newPlayers: Player[]) => {
  localStorage.setItem('players', JSON.stringify(newPlayers));
}, { deep: true });
</script>

<template>
  <v-container>
    <v-row>
      <v-col v-for="(player, index) in players.filter((player: Player) => player.isVisible)" :key="index">
        <v-card class="py-4" @click="currentPlayer = player" :class="currentPlayer === player ? 'selected-player' : ''" rounded="xl">
          <v-avatar class="player-avatar" size="xx-large" :icon="`mdi-alpha-${player.name.charAt(0).toLowerCase()}-circle`" :color="colors[index]"/>
          <v-card-title>
            <div class="text-h4 font-weight-bold pt-1 pb-6">{{ player.name }}</div>
            <v-chip size="x-large" color="indigo-darken-3" variant="flat" class="text-h4 font-weight-bold score">Score : {{ player.score }}</v-chip>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="scores-buttons mt-16">
        <v-btn size="x-large" rounded="lg" color="#978a30" v-for="score in 5" :key="score" @click="addScore(score)" class="mx-4">+{{ score }}</v-btn>
    </v-row>    
  </v-container>
</template>

<style scoped>

.player-avatar {
  font-size: 80px;
}

.selected-player {
  background-color: rgb(48, 61, 151, 0.7);
}

.score {
  padding: 30px;
  border: 1px solid white;
}

.scores-buttons {
  display: flex;
  justify-content: center;
}
</style>
