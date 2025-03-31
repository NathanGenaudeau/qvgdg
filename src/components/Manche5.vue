<script lang="ts" setup>
import { ref } from 'vue';

const isRunning = ref(false);
const numbers = ref([4, 3, 2, 1]);
const progress = ref([100, 100, 100, 100]);
const positions = ref<{ [key: number]: 'left' | 'right' }>({ 4: 'right', 3: 'left', 2: 'right', 1: 'left' });
const scores = ref({ player1: 0, player2: 0 });
let activeIndex = 0;
let timer: NodeJS.Timeout | null = null;

const toggleTimer = () => {
  if (isRunning.value) {
    clearInterval(timer!);
    timer = null;
  } else {
    timer = setInterval(() => {
      if (progress.value[activeIndex] > 0) {
        progress.value[activeIndex] -= 1;
      } else if (activeIndex < numbers.value.length - 1) {
        activeIndex++;
      } else {
        clearInterval(timer!);
        isRunning.value = false;
      }
    }, 75); // 75 = 7.5s
  }
  isRunning.value = !isRunning.value;
};

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

const addScore = (player: 'player1' | 'player2') => {
  scores.value[player] += numbers.value[activeIndex];
};
</script>


<template>
  <v-container class="text-center">
    <v-row justify="center" class="mt-5">
      <v-btn @click="toggleTimer">{{ isRunning ? 'Pause' : 'Start' }}</v-btn>
      <v-btn @click="invertNumbers" class="ml-2">Inverser</v-btn>
      <v-btn @click="swapCurrentPosition" class="ml-2">Changer côté</v-btn>
    </v-row>

    <v-row justify="space-around" class="mt-5">
      <div class="player">
        <h3>Joueur 1</h3>
        <p>Score: {{ scores.player1 }}</p>
        <v-btn @click="addScore('player1')">Correct</v-btn>
      </div>
      <div class="player">
        <h3>Joueur 2</h3>
        <p>Score: {{ scores.player2 }}</p>
        <v-btn @click="addScore('player2')">Correct</v-btn>
      </div>
    </v-row>

    <v-row justify="center" class="mt-5 align-center flex-column">
      <div v-for="(num, index) in numbers" :key="num" :class="['hexagon', getPositionClass(num)]"
        :style="{ background: `linear-gradient(to top, rgb(255, 165, 0) ${progress[index]}%, rgb(209, 186, 146) ${progress[index]}%)` }">
        {{ num }}
      </div>
    </v-row>
  </v-container>
</template>


<style>
.hexagon {
  width: 150px;
  aspect-ratio: 1 / 0.8;
  background-color: transparent;
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  position: relative;
  overflow: hidden;
}

.hex-left {
  transform: translateX(-50px);
}

.hex-right {
  transform: translateX(50px);
}

.player {
  text-align: center;
}
</style>