<template>
  <v-container class="fill-height">
    <v-responsive
      align="center"
      class="align-center fill-height mx-auto"
      max-width="900"
    >
      <h1>Você deveria estar aqui?</h1>
      <h3>Provavelmente não.</h3>
      <div>
        <button>
          <router-link :to="{ name: 'register-page' }">Registrar</router-link>
        </button>
      </div>
      <router-link :to="{ name: 'login-page' }">Entrar</router-link>
    </v-responsive>
  </v-container>
</template>

  <script setup>
  </script>
