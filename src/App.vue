<script setup lang="ts">
import { useRouter } from 'vue-router';
import { onMounted, ref, watch } from 'vue';
import { Player } from './types/Player';

const router = useRouter();
const players = ref<Player[]>([]);
const newPlayer = ref('');
const drawer = ref(false);

onMounted(() => {
  players.value = localStorage.getItem('players') ? JSON.parse(localStorage.getItem('players')!) : [];
});

/**
 * Fonction qui ajoute un joueur à la liste des joueurs
 */
const addPlayer = () => {
  if (!newPlayer.value) return;

  players.value.push(new Player(newPlayer.value));  
  localStorage.setItem('players', JSON.stringify(players.value));
  newPlayer.value = '';
};

/**
 * Fonction qui supprime un joueur de la liste des joueurs
 * @param player 
 */
const deletePlayer = (player: Player) => {
  players.value = players.value.filter(p => p !== player);
  localStorage.setItem('players', JSON.stringify(players.value));
};

/**
 * Fonction qui rend visible/invisible un joueur dans les différents jeux
 * @param player 
 */
const isVisible = (player: Player) => {
  const index = players.value.findIndex(p => p === player);
  players.value[index].isVisible = !players.value[index].isVisible;
  localStorage.setItem('players', JSON.stringify(players.value));
};

const toggleEdit = (player: Player) => {
  player.isEditing = !player.isEditing;
};

watch(players, (newPlayers) => {
  localStorage.setItem('players', JSON.stringify(newPlayers));
}, { deep: true });
</script>

<template>
  <v-layout class="app rounded rounded-md">
    <v-app-bar>
      <template v-slot:prepend>
        <v-btn icon="mdi mdi-home" @click="router.push('/')" />
        <v-btn @click="router.push({ name: 'Manche 1' })">Manches 1 & 2</v-btn>
        <v-btn @click="router.push({ name: 'Sabotage' })">Sabotage</v-btn>
        <v-btn @click="router.push({ name: '4 à la suite' })">4 à la suite</v-btn>
        <v-btn @click="router.push({ name: 'Finale' })">Finale</v-btn>
      </template>
      <template v-slot:append>
        <v-btn icon="mdi-cog" @click.stop="drawer = !drawer" />
      </template>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" temporary location="right">
      <v-list>
          <v-col v-for="(player, index) in players" :key="index" class="py-1">
            <v-card color="indigo-darken-3" density="compact">
              <template v-slot:append>
                <v-icon :icon="player.isVisible ? 'mdi-eye' : 'mdi-eye-off'" :color="player.isVisible ? 'white' : 'red'" @click="isVisible(player)"/>
                <v-icon icon="mdi-close-thick" color="red" @click="deletePlayer(player)"/>
              </template>
              <v-card-title class="pa-0" @dblclick="toggleEdit(player)">
                <v-avatar class="player-avatar" :icon="`mdi-alpha-${player.name.charAt(0).toLowerCase()}-circle`" color="transparent"/>
                <v-text-field
                  v-if="player.isEditing"
                  v-model="player.name"
                  @blur="toggleEdit(player)"
                  density="compact"
                  variant="outlined"
                  autofocus
                />
                <span v-else class="d-block	">{{ player.name }}</span>
              </v-card-title>
              <v-card-text class="py-2">
                <v-number-input
                  density="compact"
                  controlVariant="split"
                  label="Score"
                  :hideInput="false"
                  v-model="player.score"
                ></v-number-input>
              </v-card-text>
            </v-card>
          </v-col>
        </v-list>
        <v-col>
          <v-text-field label="Nom du joueur" v-model="newPlayer"></v-text-field>
          <v-btn @click="addPlayer" color="#978a30" class="mt-2">Ajouter</v-btn>
        </v-col>
      </v-navigation-drawer>
    <v-main >
      <router-view @openNavigationDrawer="drawer = !drawer" />
    </v-main>
  </v-layout>
</template>

<style>
#app {
  width: 100vw;
  max-width: 100vw;
}

.player-avatar {
  font-size: 40px;
}

.v-input__details {
  display: none!important;
}

.v-card-item {
  padding: 4px 4px 0px 4px!important;
}
</style>
