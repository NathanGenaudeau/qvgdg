<script setup lang="ts">
import { ref } from 'vue';
import { VueDraggableNext } from "vue-draggable-next";

import Themes from '../assets/themes.json';

interface Answer {
  text: string;
  isCorrect: boolean;
}

interface Question {
  question: string;
  answers: Answer[];
}

interface Theme {
  name: string;
  questions: Question[];
}

interface Player {
  name: string;
  theme1: Theme[];
  theme2: Theme[];
  isEditing: boolean;
}

const themes = ref<Theme[]>(Themes.themes);

const players = ref<Player[]>([
  { name: "Camille", theme1: [], theme2: [], isEditing: false },
  { name: "Loïc", theme1: [], theme2: [], isEditing: false },
  { name: "Martial", theme1: [], theme2: [], isEditing: false },
  { name: "Nathan", theme1: [], theme2: [], isEditing: false },
]);

const colors = <string[]>['red', 'light-blue', 'green', 'indigo'].sort(() => Math.random() - 0.5);

const toggleEdit = (player: Player) => {
  player.isEditing = !player.isEditing;
};

const dialog = ref(false);
const currentTheme = ref<Theme | null>(null);
const currentPlayer = ref<Player | null>(null);
const currentQuestion = ref(0);
const selectedAnswer = ref<Answer | null>(null);

// Ouvre une modale qui affiche les questions du thème sélectionné
const openTheme = (player: Player, theme: Theme) => {
  dialog.value = true;
  currentPlayer.value = player;
  currentTheme.value = theme;
};


// Affiche la bonne réponse si la réponse est fausse
const verifyAnswer = (answer: Answer) => {
  selectedAnswer.value = answer;
  Array.from(document.getElementsByClassName('answer-btn')).forEach((btn: any, index: number) => {
    if (currentTheme.value?.questions[currentQuestion.value].answers[index].isCorrect) {
      btn.classList.add('good');
    }
  });
};

// Passe à la question suivante et réinitialise les classes de style des boutons
const nextQuestion = () => {
  currentQuestion.value++;
  selectedAnswer.value = null;
  Array.from(document.getElementsByClassName('answer-btn')).forEach((btn: any) => {
    btn.classList.remove('good');
    btn.classList.remove('bad');
  });
};
</script>

<template>
  <v-container>
    <v-row>
      <v-col v-for="(player, index) in players" :key="index" cols="3">
        <v-card class="pa-4">
          <v-avatar class="avatar-candidate" size="xx-large" :icon="`mdi-alpha-${player.name.charAt(0).toLowerCase()}-circle`" :color="colors[index]"/>
          <v-card-title @dblclick="toggleEdit(player)">
            <v-text-field
              v-if="player.isEditing"
              v-model="player.name"
              @blur="toggleEdit(player)"
              density="compact"
              variant="outlined"
              autofocus
            />
            <span v-else>{{ player.name }}</span>
          </v-card-title>

          <vue-draggable-next v-model="player.theme1" group="themes" :disabled="player.theme1[0]" class="theme-drop-zone mx-4">
            <v-chip v-if="player.theme1[0]" class="theme" variant="flat" color="#212121" size="x-large">
              <h3 @click="openTheme(player, player.theme1[0])">{{ player.theme1[0]?.name }}</h3>
            </v-chip>
          </vue-draggable-next>
          <vue-draggable-next v-model="player.theme2" group="themes" :disabled="player.theme2[0]" class="theme-drop-zone mx-4">
            <v-chip v-if="player.theme2[0]" class="theme" variant="flat" color="#212121" size="x-large">
              <h3 @click="openTheme(player, player.theme2[0])">{{ player.theme2[0]?.name }}</h3>
            </v-chip>
          </vue-draggable-next>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-16 justify-center">
      <v-col cols="5">
        <vue-draggable-next v-model="themes" group="themes" class="theme-pool justify-center">
          <v-chip v-for="(theme, index) in themes" :key="index" draggable variant="outlined" label class="ma-1" size="x-large">
            {{ theme.name }}
          </v-chip>
        </vue-draggable-next>
      </v-col>
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
          <v-avatar :icon="`mdi-alpha-${currentPlayer?.name.charAt(0).toLowerCase()}-circle`"/> : 
          <span>{{ currentTheme?.name }}</span>
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
              <v-btn class="answer-btn" :class="{good: answer.isCorrect && selectedAnswer?.text === answer.text, bad: !answer.isCorrect && selectedAnswer?.text === answer.text}" variant="outlined" @click="verifyAnswer(answer)">
                {{ answer.text }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-container>

      <v-container class="d-flex justify-end align-end">
        <v-btn v-if="selectedAnswer" @click="currentTheme && currentQuestion === currentTheme?.questions.length - 1 ? dialog = false : nextQuestion()" color="green" class="mb-8">
          {{ currentTheme && currentQuestion === currentTheme?.questions.length - 1 ? 'Fin' : 'Suivante' }}
        </v-btn>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.theme-drop-zone {
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

.avatar-candidate {
  font-size: 150px;
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
  width: 400px;
  height: 150px;
  font-size: 1.5rem;
  font-weight: bold;
}

.good {
  background-color: green;
}
.bad {
  background-color: red;
}
</style>
