<template>
  <AppLoading v-if="loading" />
  <v-container class="fill-height">
    <v-responsive
      align="center"
      class="align-center fill-height mx-auto"
      max-width="900"
    >
      <v-card max-width="500">
        <v-card-text>
          <div align="center" class="text-h3 mb-5">Bem-vindo</div>
          <div align="center" class="text-h6 mb-5">Para começar crie sua conta.</div>
          <v-form ref="form">
            <v-text-field
              v-model="state.register.email"
              class="mb-2"
              label="Email"
              :rules="regraEmail"
              variant="outlined"
            />

            <v-text-field
              v-model="state.register.password"
              class="mb-2"
              label="Senha"
              maxlength="8"
              minlength="8"
              :rules="[(texto: string) => required(texto) || 'Campo obrigatório']"
              type="password"
              variant="outlined"
            />

            <v-btn block prepend-icon="mdi-google" variant="outlined" @click="singInWithGoogle">
              Fazer login com Google
            </v-btn>

            <v-btn block class="mt-2" @click="validForm">Registrar</v-btn>
          </v-form>
        </v-card-text>
        <v-spacer />
        <div align="end" class="mb-2 mr-4"><span>Já tenho conta </span> <span style="color: #8cb4ff; cursor: pointer;" @click="$router.push('/login')">Fazer Login</span></div>
      </v-card>
    </v-responsive>
  </v-container>
</template>

  <script setup lang="ts">

  import { reactive, ref } from 'vue'
  import { LoginModel } from '@/models/LoginModel'
  import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
  import { email, required } from '@/validation/rules'
  import { notify } from '@kyvg/vue3-notification'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const form = ref()
  const loading = ref(false)
  const auth = getAuth()

  interface State {
    register: LoginModel
  }

  const state = reactive<State>({
    register: {} as LoginModel,
  })

  const regraEmail = [
    (texto: string) => email(texto) || 'Email inválido',
    (texto: string) => required(texto) || 'Campo obrigatório',
  ]

  const validForm = async () => {
    const result = await form.value.validate()
    if (await result.valid) {
      register()
    }
  }

  const register = async () => {
    loading.value = true

    await createUserWithEmailAndPassword(auth, state.register.email, state.register.password)
      .then(data => {
        router.push('/login')
        notify({
          title: 'Sucesso!',
          text: 'Registro realizado com sucesso.',
          type: 'success',
        })
      }
      ).catch(error => {
        notify({
          title: 'Erro!',
          text: error.code === 'auth/email-already-in-use' ? 'E-mail já está em uso.' : 'Falha ao tentar registrar.',
          type: 'error',
        })
      }
      )
    loading.value = false
  }

  const singInWithGoogle = () => {
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
      .then(result => {
        console.log(result.user)
        router.push('/home')
        notify({
          title: 'Sucesso!',
          text: 'Login realizado com sucesso.',
          type: 'success',
        })
      })
      .catch(error => {
        console.log(error)
        notify({
          title: 'Erro!',
          text: 'Falha ao tentar registrar.',
          type: 'error',
        })
      })
  }

  </script>
