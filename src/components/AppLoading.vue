<script setup lang="ts">
  import { ref } from 'vue'

  const overlay = ref(true)

</script>

<template>
  <v-overlay v-model="overlay" class="align-center justify-center" :persistent="true">
    <v-progress-circular color="#8cb4ff" indeterminate :persistent="true" size="64" />
  </v-overlay>
</template>
