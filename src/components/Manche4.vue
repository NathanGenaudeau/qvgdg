<script setup lang="ts">
import { ref, watch } from 'vue';

import { Player } from '../types/Player';

const players = ref<Player[]>(localStorage.getItem('players') ? JSON.parse(localStorage.getItem('players')!) : []);

const colors = ref<string[]>(['red-darken-4', 'light-blue', 'green', 'yellow-darken-4', 'deep-purple-darken-2']);

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
        <v-card class="pa-4" rounded="xl">
          <v-avatar class="player-avatar" size="xx-large" :icon="`mdi-alpha-${player.name.charAt(0).toLowerCase()}-circle`" :color="colors[index]"/>
          <v-card-title>
            <div class="text-h4 font-weight-bold pt-1 pb-6">{{ player.name }}</div>
            <v-item-group v-model="player.scoreSemiFinal" >
              <v-item v-for="(n, index) in 5" :key="index">
                <template v-slot:default="{ toggle }">
                  <v-btn
                    size="60px"
                    :active="player.scoreSemiFinal != null && player.scoreSemiFinal >= index"
                    :color="player.scoreSemiFinal != null && player.scoreSemiFinal >= index ? 'green' : ''"
                    :icon="`mdi-numeric-${index}`"
                    border
                    @click="toggle"
                    class="text-h5 button-score"
                    :class="[{'left-border': index === 0}, {'right-border': index === 4}]"
                  ></v-btn>
                </template>
              </v-item>
            </v-item-group>
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
  font-size: 80px;
}

.themes {
  display: inline-block;
}

.button-score {
  border-radius: 0;
}

.left-border {
  border-radius: 8px 0 0 8px;
}
.right-border {
  border-radius: 0 8px 8px 0;
}
</style>
