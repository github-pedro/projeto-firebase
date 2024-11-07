<template>
  <v-container class="fill-height">
    <v-responsive
      align="center"
    >

      <v-card min-height="700">
        <v-toolbar color="#F6820D">

          <v-spacer />

          <v-icon class=" mr-3" size="x-large">mdi-account-circle</v-icon>
          <h4 class="mt-1 mr-4">{{ auth.currentUser.displayName }}</h4>
          <v-btn class="mt-2 mr-2" variant="outlined" @click="logout">Sair</v-btn>

        </v-toolbar>

        <v-card flat>
          <v-row no-gutters>
            <v-spacer />
            <v-btn class="mt-2 mr-2" variant="outlined" @click="dialog = true">Cadastrar Alimento</v-btn>
          </v-row>

          <v-card-text height="100%">
            <AppDataTable
              :headers="header"
              :hide="false"
              :items="state.alimentos"
              :total-elements="state.alimentos.length"
            >
              <template #[`item.index`]="{ item, index }">
                {{ index +1 }}
              </template>
              <template #[`item.acoes`]="{ item }">
                <v-btn
                  class="mr-2"
                  color="#5E6679"
                  icon="mdi-pencil"
                  size="30"
                  @click="getAlimentosId(item.id)"
                />
                <v-btn color="#5E6679" icon="mdi-trash-can" size="30" @click="deleteAlimento(item.id)" />

              </template>
            </AppDataTable>
          </v-card-text>
        </v-card>
      </v-card>
    </v-responsive>
    <v-dialog
      v-model="dialog"
      max-width="600"
      persistent
    >
      <v-form ref="form">
        <v-card
          title="Cadastro de Alimento"
        >
          <v-card-text>
            <v-row dense>
              <v-col
                cols="12"
                sm="6"
              >
                <v-autocomplete
                  v-model="state.model.familia"
                  item-title="familia"
                  item-value="familia"
                  :items="familiaAlimentos"
                  label="Família*"
                  :return-object="false"
                  :rules="[(texto: string) => required(texto) || 'Campo obrigatório']"
                  variant="outlined"
                />
              </v-col>
              <v-col
                cols="12"
                sm="6"
              >
                <v-autocomplete
                  v-model="state.model.tipo"
                  item-title="tipo"
                  item-value="tipo"
                  :items="tipoAlimentos"
                  label="Tipo*"
                  :return-object="false"
                  :rules="[(texto: string) => required(texto) || 'Campo obrigatório']"
                  variant="outlined"
                />
              </v-col>
              <v-col
                cols="12"
                sm="6"
              >
                <v-text-field
                  v-model="state.model.descricao"
                  label="Descrição"
                  required
                  :rules="[(texto: string) => required(texto) || 'Campo obrigatório']"
                  variant="outlined"
                />
              </v-col>
              <v-col
                cols="12"
                sm="6"
              >
                <v-text-field
                  v-model.number="state.model.quantidade"
                  label="Quantidade"
                  maxlength="5"
                  minlength="5"
                  required
                  :rules="[(texto: string) => required(texto) || 'Campo obrigatório']"
                  type="number"
                  variant="outlined"
                />
              </v-col>

            </v-row>
          </v-card-text>

          <v-divider />

          <v-card-actions>
            <v-spacer />

            <v-btn
              text="Fechar"
              variant="outlined"
              @click="dialog = false"
            />

            <v-btn
              color="primary"
              text="Salvar"
              variant="outlined"
              @click="validForm"
            />
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
  import AppDataTable from '@/components/AppDataTable/AppDataTable.vue'
  import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, updateDoc } from 'firebase/firestore'
  import { getAuth, signOut } from 'firebase/auth'
  import { useRouter } from 'vue-router'
  import { onMounted, reactive, ref } from 'vue'
  import { required } from '@/validation/rules'
  import { Alimento } from '@/models/AlimentosModel'
  import { notify } from '@kyvg/vue3-notification'

  const header = ref([
    {
      title: 'Item',
      align: 'start',
      sortable: false,
      key: 'index',
    },
    { title: 'Família', key: 'familia', sortable: false, align: 'start' },
    { title: 'Tipo', key: 'tipo', sortable: false, align: 'start' },
    { title: 'Descrição', key: 'descricao', align: 'center', sortable: false, width: '200px' },
    { title: 'Quantidade', key: 'quantidade', sortable: false, align: 'center' },
    { title: 'Ações', key: 'acoes', align: 'center', sortable: false, width: '200px' },
  ])
  const dialog = ref(false)
  const familiaAlimentos = ref([] as {familia:string}[])
  const tipoAlimentos = ref([] as {tipo:string}[])

  interface State {
    model: Alimento
    alimentos: Alimento[]
  }

  const state = reactive<State>({
    model: {} as Alimento,
    alimentos: [] as Alimento[],
  })

  const form = ref()

  const db = getFirestore()
  const router = useRouter()
  const auth = getAuth()

  onMounted(async () => {
    init()
  })

  const init = () => {
    getAlimentos()
    getFamilia()
    getTipoAlimento()
  }

  const validForm = async () => {
    const result = await form.value.validate()
    if (await result.valid) {
      if (!state.model.id) {
        addAlimento()
      } else {
        updateAlimento()
      }
    }
  }

  const getAlimentos = async () => {
    state.alimentos = [] as Alimento[]
    const getAlimentos = await getDocs(collection(db, 'alimentos'))
    getAlimentos.forEach(doc => {
      state.alimentos.push({ ...doc.data(), id: doc.id })
    })
  }
  const getFamilia = async () => {
    familiaAlimentos.value = [] as {familia:string}[]
    const getAlimentos = await getDocs(collection(db, 'familiaAlimentos'))
    getAlimentos.forEach(doc => {
      familiaAlimentos.value.push({ ...doc.data(), id: doc.id })
    })
  }
  const getTipoAlimento = async () => {
    tipoAlimentos.value = [] as {tipo:string}[]
    const getAlimentos = await getDocs(collection(db, 'tiposAlimentos'))
    getAlimentos.forEach(doc => {
      tipoAlimentos.value.push({ ...doc.data(), id: doc.id })
    })
  }

  const addAlimento = async () => {
    await addDoc(collection(db, 'alimentos'), state.model)
      .then(resp => {
        notify({
          title: 'Sucesso!',
          text: 'Cadastro realizado com sucesso.',
          type: 'success',
        })
        init()
        dialog.value = false
        state.model = {} as Alimento
      })
      .catch(error => {
        console.log(error)
        notify({
          title: 'Erro!',
          text: 'Falha ao tentar cadastrar.',
          type: 'error',
        })
      })
  }

  const updateAlimento = async () => {
    await updateDoc(doc(db, 'alimentos', state.model.id), state.model)
      .then(resp => {
        notify({
          title: 'Sucesso!',
          text: 'Edição realizada com sucesso.',
          type: 'success',
        })
        init()
        dialog.value = false
        state.model = {} as Alimento
      })
      .catch(error => {
        console.log(error)
        notify({
          title: 'Erro!',
          text: 'Falha ao tentar editar.',
          type: 'error',
        })
      })
  }

  const deleteAlimento = async (id: string) => {
    await deleteDoc(doc(db, 'alimentos', id))
      .then(resp => {
        notify({
          title: 'Sucesso!',
          text: 'Exclusão realizada com sucesso.',
          type: 'success',
        })
        init()
      })
      .catch(error => {
        console.log(error)
        notify({
          title: 'Erro!',
          text: 'Falha ao tentar excluir.',
          type: 'error',
        })
      })
  }

  const getAlimentosId = async (id: string) => {
    const getAlimentos = await getDoc(doc(db, 'alimentos', id))
    state.model = { id: getAlimentos.id, ...getAlimentos.data() }
    dialog.value = true
  }

  const logout = async () => {
    signOut(auth)
    router.push('/login')
  }
</script>
