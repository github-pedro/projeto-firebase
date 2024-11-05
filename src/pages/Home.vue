<template>
  <v-container class="fill-height">
    <v-responsive
      align="center"
      class="align-center fill-height mx-auto"
      max-width="900"
    >
      <div><h2>Parabéns, você está logado!</h2></div>
      <v-btn class="mt-2" @click="logout">Sair</v-btn>
    </v-responsive>
  </v-container>
</template>

<script setup>
  import { getAuth, signOut } from 'firebase/auth'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const auth = getAuth()

  const logout = () => {
    signOut(auth)
    router.push('/login')
  }
</script>
