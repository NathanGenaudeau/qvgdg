<script lang="ts" setup>
import { ref, watch } from 'vue';
import { Player } from '../types/Player';

const isRunning = ref(false);
const numbers = ref([4, 3, 2, 1]);
const progress = ref([100, 100, 100, 100]);
const positions = ref<{ [key: number]: 'left' | 'right' }>({ 4: 'left', 3: 'right', 2: 'left', 1: 'right' });
let activeIndex = 0;
let timer: NodeJS.Timeout | null = null;

const players = ref<Player[]>(localStorage.getItem('players') ? JSON.parse(localStorage.getItem('players')!).filter((p: Player) => p.isVisible) : []);
const activePlayer = ref<Player>(players.value[0]);

const colors = ref<string[]>(['red-darken-4', 'light-blue', 'green', 'yellow-darken-4', 'deep-purple-darken-2'].sort(() => Math.random() - 0.5));

const toggleTimer = () => {
  if (isRunning.value) {
    clearInterval(timer);
    timer = null;
  } else {
    timer = setInterval(() => {
      activePlayer.value = positions.value[numbers.value[activeIndex]] === 'left' ? players.value[0] : players.value[1];
      if (progress.value[activeIndex] > 0) {
        progress.value[activeIndex] -= 1;
      } else if (activeIndex < numbers.value.length - 1) {
        activeIndex++;
      } else {
        clearInterval(timer);
        isRunning.value = false;
      }
    }, 75); // 75 = 7.5s
  }
  isRunning.value = !isRunning.value;
};

const resetTimer = () => {
  while (activeIndex >= 0) {
    progress.value[activeIndex] = 100;
    activeIndex = activeIndex - 1;
  }
  activeIndex = 0;
  clearInterval(timer);
  isRunning.value = false;
}

const invertNumbers = () => {
  Object.keys(positions.value).forEach(key => {
    positions.value[parseInt(key)] = positions.value[parseInt(key)] === 'left' ? 'right' : 'left';
  });
};

const swapCurrentPosition = () => {
  const currentNumber = numbers.value[activeIndex];
  positions.value[currentNumber] = positions.value[currentNumber] === 'left' ? 'right' : 'left';
};

const getPositionClass = (num: number) => {
  return positions.value[num] === 'left' ? 'hex-left' : 'hex-right';
};

const addScore = (player: Player) => {
  player.scoreFinal += numbers.value[activeIndex];
};

watch(players, (newPlayers: Player[]) => {
  localStorage.setItem('players', JSON.stringify(newPlayers));
}, { deep: true });


watch(positions, () => {
  activePlayer.value = positions.value[numbers.value[activeIndex]] === 'left' ? players.value[0] : players.value[1];
}, { deep: true });
</script>


<template>
  <v-container class="text-center">
    <v-row>
      <v-col cols="3">
        <v-card class="py-4" rounded="xl" :class="{active: activePlayer === players[0]}">
          <v-avatar class="player-avatar" size="xx-large" :icon="`mdi-alpha-${players[0].name.charAt(0).toLowerCase()}-circle`" :color="colors[0]"/>
          <v-card-title class="d-flex flex-column align-center">
            <div class="text-h4 font-weight-bold pt-1 pb-6">{{ players[0].name }}</div>
            <v-chip size="x-large" color="indigo-darken-3" variant="flat" class="text-h4 font-weight-bold score">Score : {{ players[0].scoreFinal }}</v-chip>
              <v-btn color="green" icon="mdi-plus-thick" class="mt-4" @click="addScore(players[0])"></v-btn>
          </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-row justify="center" class="align-center flex-column">
          <div v-for="(num, index) in numbers" :key="num" :class="['hexagon', getPositionClass(num), 'my-1']"
            :style="{ background: `linear-gradient(to top, rgb(255, 165, 0) ${progress[index]}%, rgb(128, 128, 128) ${progress[index]}%)` }">
            {{ num }}
          </div>
        </v-row>

        <v-row justify="center" class="mt-16 justify-space-evenly">
          <v-btn rounded="lg" color="green" variant="outlined" @click="toggleTimer">{{ isRunning ? 'Pause' : 'Start' }}</v-btn>
          <v-btn rounded="lg" color="red" variant="outlined" @click="resetTimer">Reset</v-btn>
          <v-btn rounded="lg" variant="outlined" @click="invertNumbers">Inverser côtés</v-btn>
          <v-btn rounded="lg" variant="outlined" @click="swapCurrentPosition">Changement côté</v-btn>
        </v-row>

      </v-col>
      <v-col cols="3">
        <v-card class="py-4" rounded="xl" :class="{active: activePlayer === players[1]}">
          <v-avatar class="player-avatar" size="xx-large" :icon="`mdi-alpha-${players[1].name.charAt(0).toLowerCase()}-circle`" :color="colors[1]"/>
          <v-card-title class="d-flex flex-column align-center">
            <div class="text-h4 font-weight-bold pt-1 pb-6">{{ players[1].name }}</div>
            <v-chip size="x-large" color="indigo-darken-3" variant="flat" class="text-h4 font-weight-bold score">Score : {{ players[1].scoreFinal }}</v-chip>
            <v-btn color="green" icon="mdi-plus-thick" class="mt-4" @click="addScore(players[1])"></v-btn>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<style scoped>
.hexagon {
  width: 150px;
  aspect-ratio: 1 / 0.8;
  background-color: transparent;
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 72px;
  font-weight: bold;
  position: relative;
  overflow: hidden;
}

.hex-left {
  transform: translateX(-30px);
}

.hex-right {
  transform: translateX(30px);
}

.player-avatar {
  font-size: 80px;
}

.score {
  padding: 30px!important;
}

.active {
  border: 2px solid green;
  animation: blink-border 2s infinite;
}

@keyframes blink-border {
  0% { border-color: lightgreen; }
  50% { border-color: green; }
  100% { border-color: lightgreen; }
}
</style>