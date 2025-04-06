<script setup lang="ts">
import { ref, watch } from 'vue';
import { VueDraggableNext } from "vue-draggable-next";

import { Player } from '../types/Player';
import type { Theme } from '../types/Theme';
import type { Answer } from '../types/Answer';
import Themes from '../assets/themes.json';

const emit = defineEmits(['openNavigationDrawer']);

const players = ref<Player[]>(localStorage.getItem('players') ? JSON.parse(localStorage.getItem('players')!) : []);
const themes = ref<Theme[]>(Themes.themes.filter(t => !players.value.flatMap((p) => [...p.theme1, ...p.theme2]).some(theme => theme.name === t.name)));

const colors = ref<string[]>(['red-darken-4', 'light-blue', 'green', 'yellow-darken-4']);

const dialog = ref(false);
const currentTheme = ref<Theme | null>(null);
const currentPlayer = ref<Player | null>(null);
const currentQuestion = ref(0);
const selectedAnswer = ref<Answer | null>(null);

/**
 * Fonction qui ouvre une modale et qui affiche les questions du thème sélectionné
 * @param player 
 * @param theme 
 */
// 
const openTheme = (player: Player, theme: Theme) => {
  if (!theme.questions.length) return;
  dialog.value = true;
  currentPlayer.value = player;
  currentTheme.value = theme;
};

/**
 * Fonction qui supprime le thème d'un joueur
 * @param player 
 * @param theme 
 */
const deleteTheme = (player: Player, theme: Theme) =>  {
  if (player.theme1[0] === theme) player.theme1 = [];
  if (player.theme2[0] === theme) player.theme2 = [];
  themes.value.push(theme);
}

/**
 * Fonction qui affiche la bonne réponse si la réponse donnée est fausse
 * @param answer 
 */
const verifyAnswer = (answer: Answer) => {
  selectedAnswer.value = answer;
  if (answer.isCorrect && currentPlayer.value) currentPlayer.value.score += 2;
  Array.from(document.getElementsByClassName('answer-btn')).forEach((btn: any, index: number) => {

    if (currentTheme.value?.questions[currentQuestion.value].answers[index].isCorrect) {
      btn.classList.add('good');
    }
  });
};

/**
 * Fonction qui passe à la question suivante et réinitialise les classes de style des boutons
 */
const nextQuestion = () => {
  currentQuestion.value++;
  selectedAnswer.value = null;
  Array.from(document.getElementsByClassName('answer-btn')).forEach((btn: any) => {
    btn.classList.remove('good');
    btn.classList.remove('bad');
  });

  if (currentPlayer.value?.score !== undefined && currentQuestion.value === currentTheme.value?.questions.length) {
    currentQuestion.value = 0;
    dialog.value = false;
    const index = players.value.findIndex(p => p === currentPlayer.value);
    players.value[index].score = currentPlayer.value.score;
    localStorage.setItem('players', JSON.stringify(players.value));
  }
};

const getFontSize = (text: any) => {
  const baseSize = 1.5;
  const length = text.length;
  const minSize = 0.8;
  const maxLength = 200;

  const size = Math.max(minSize, baseSize - (length / maxLength));
  return `font-size: ${size}rem`;
}

const isVisible = (player: Player) => {
  const index = players.value.findIndex(p => p === player);
  players.value[index].isVisible = !players.value[index].isVisible;
  localStorage.setItem('players', JSON.stringify(players.value));
};

watch(players, (newPlayers: Player[]) => {
  localStorage.setItem('players', JSON.stringify(newPlayers));
}, { deep: true });
</script>

<template>
  <v-container>
    <v-row>
      <v-col v-for="(player, index) in players.filter((player: Player) => player.isVisible)" :key="index" cols="3">
        <v-card class="pa-4" rounded="xl">
          <template v-slot:append>
            <v-icon :icon="player.isVisible ? 'mdi-eye' : 'mdi-eye-off'" :color="player.isVisible ? 'white' : 'red'" @click="isVisible(player)"/>
          </template>
          <v-avatar class="player-avatar-1" size="xx-large" :icon="`mdi-alpha-${player.name.charAt(0).toLowerCase()}-circle`" :color="colors[index]"/>
          <v-card-title>
            <div class="text-h4 font-weight-bold pt-1 pb-6">{{ player.name }}</div>
            <v-chip size="x-large" color="indigo-darken-3" variant="flat" class="text-h4 font-weight-bold score">Score : {{ player.score }}</v-chip>
          </v-card-title>

          <vue-draggable-next v-model="player.theme1" group="themes" :disabled="player.theme1.length" class="theme-drop-zone my-4">
            <v-chip v-if="player.theme1[0]" class="theme" variant="flat" color="#212121" size="large" closable @click:close="deleteTheme(player, player.theme1[0])">
              <h3 @click="openTheme(player, player.theme1[0])">{{ player.theme1[0]?.name }}</h3>
            </v-chip>
          </vue-draggable-next>
          <vue-draggable-next v-model="player.theme2" group="themes" :disabled="player.theme2.length" class="theme-drop-zone my-2">
            <v-chip v-if="player.theme2[0]" class="theme" variant="flat" color="#212121" size="large" closable @click:close="deleteTheme(player, player.theme2[0])">
              <h3 @click="openTheme(player, player.theme2[0])">{{ player.theme2[0]?.name }}</h3>
            </v-chip>
          </vue-draggable-next>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-16 px-16 justify-center">
      <vue-draggable-next v-model="themes" group="themes" class="theme-pool justify-center">
        <v-col v-for="(theme, index) in themes" :key="index" cols="auto">
          <v-chip draggable variant="outlined" label class="font-weight-bold" size="x-large">
            {{ theme.name }}
          </v-chip>
        </v-col>
      </vue-draggable-next>
    </v-row>
  </v-container>

  <v-dialog
    v-model="dialog"
    transition="dialog-bottom-transition"
    fullscreen
  >
    <v-card>
      <v-toolbar>
        <v-btn
          icon="mdi-close"
          @click="dialog = false"
        ></v-btn>
        <v-toolbar-title>
          <v-avatar :icon="`mdi-alpha-${currentPlayer?.name.charAt(0).toLowerCase()}-circle`" size="x-large" class="text-h4"/>
          <v-chip size="x-large" color="green-darken-3" variant="flat" class="font-weight-bold mx-4">{{ currentTheme?.name }}</v-chip>
          <v-chip size="x-large" color="indigo-darken-3" variant="flat" class="font-weight-bold">Score : {{ currentPlayer?.score }}</v-chip>
        </v-toolbar-title>
      </v-toolbar>

      <v-container class="quiz-container">
        <h1 class="quiz-question mb-16">
          {{ currentTheme?.questions[currentQuestion].question }}
        </h1>

        <v-container class="quiz-answers mt-16">
          <v-row justify="center">
            <v-col v-for="(answer, index) in currentTheme?.questions[currentQuestion].answers" 
                  :key="index" 
                  cols="6" 
                  class="d-flex justify-center">
              <v-btn class="answer-btn" 
                :class="[
                  {
                    good: answer.isCorrect && selectedAnswer?.text === answer.text,
                    bad: !answer.isCorrect && selectedAnswer?.text === answer.text
                  }
                ]"
                variant="outlined" @click="verifyAnswer(answer)"
              >
                <span class="answer-text" :style="getFontSize(answer.text)">{{ answer.text }}</span>
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-container>

      <v-container class="d-flex justify-end align-end">
        <v-btn v-if="selectedAnswer" @click="nextQuestion" color="green" class="mb-8">
          {{ currentTheme && currentQuestion === currentTheme?.questions.length - 1 ? 'Fin' : 'Suivante' }}
        </v-btn>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<style>
button.v-chip__close {
  padding: 0!important;
}
.theme-drop-zone {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50px;
  border: 3px solid #ccc;
  border-radius: 5px;
  margin-top: 20px;
}

.theme-pool {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.player-avatar-1 {
  font-size: 80px;
}

.score {
  padding: 30px;
}

.theme {
  cursor: pointer;
}

.quiz-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.quiz-question {
  font-size: 2.5rem;
  font-weight: bold;
}

.quiz-answers {
  width: 60%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.answer-btn {
  width: 400px !important;
  height: 150px !important;
}

.answer-text {
  white-space: normal;
  line-height: 1.2;
  font-weight: bold;
}

.good {
  background-color: green;
}
.bad {
  background-color: red;
}
</style>
