<template>

  <v-app>
    <v-main class="background">
      <v-spacer />
      <div align="end"><v-btn class="mt-2 mr-2" prepend-icon="mdi-theme-light-dark" @click="toggleTheme">Tema</v-btn></div>

      <router-view />
      <notifications class="mt-10" />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  import { useTheme } from 'vuetify'

  const theme = useTheme()
  function toggleTheme () {
    theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
  }
</script>
<style>
.v-theme--light {
  .background {
    background-color: #A6AEBF;
  }
}
</style>
