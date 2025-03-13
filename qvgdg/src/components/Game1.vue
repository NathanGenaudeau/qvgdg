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

interface Candidate {
  name: string;
  themes: Theme[];
  isEditing: boolean;
}

const themes = ref<Theme[]>(Themes.themes);

const candidates = ref<Candidate[]>([
  { name: "Camille", themes: [], isEditing: false },
  { name: "Loïc", themes: [], isEditing: false },
  { name: "Martial", themes: [], isEditing: false },
  { name: "Nathan", themes: [], isEditing: false },
]);

const colors = <string[]>['red', 'light-blue', 'green', 'indigo'].sort(() => Math.random() - 0.5);

const toggleEdit = (candidate: any) => {
  candidate.isEditing = !candidate.isEditing;
};
</script>

<template>
  
  <v-container>
    <v-row>
      <v-col v-for="(candidate, index) in candidates" :key="index" cols="3">
        <v-card class="pa-3">
          <v-avatar class="avatar-candidate" size="xx-large" :icon="`mdi-alpha-${candidate.name.charAt(0).toLowerCase()}-circle`" :color="colors[index]"/>
          <v-card-title @dblclick="toggleEdit(candidate)">
            <v-text-field
              v-if="candidate.isEditing"
              v-model="candidate.name"
              @blur="toggleEdit(candidate)"
              density="compact"
              variant="outlined"
              autofocus
            />
            <span v-else>{{ candidate.name }}</span>
          </v-card-title>

          <vue-draggable-next v-model="candidate.themes" group="themes" class="theme-drop-zone">
            <v-chip v-for="(theme, i) in candidate.themes" :key="i" color="primary" class="ma-1">
              {{ theme.name }}
            </v-chip>
          </vue-draggable-next>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <vue-draggable-next v-model="themes" group="themes" class="theme-pool">
          <v-chip v-for="(theme, index) in themes" :key="index" draggable color="secondary" class="ma-1">
            {{ theme.name }}
          </v-chip>
        </vue-draggable-next>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.theme-drop-zone {
  min-height: 50px;
  border: 2px dashed #aaa;
  padding: 10px;
}

.theme-pool {
  display: flex;
  flex-wrap: wrap;
}

.avatar-candidate {
  font-size: 150px;
}
</style>
