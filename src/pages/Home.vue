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
              :items="alimentos"
              :total-elements="alimentos.length"
            >
              <template #[`item.index`]="{ item, index }">
                {{ index +1 }}
              </template>
              <template #[`item.acoes`]="{ }">
                <v-btn class="mr-2" color="#5E6679" icon="mdi-pencil" size="30" />
                <v-btn color="#5E6679" icon="mdi-trash-can" size="30" />

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
                  v-model="model.familia"
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
                  v-model="model.tipo"
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
              >
                <v-text-field
                  label="Descrição"
                  required
                  :rules="[(texto: string) => required(texto) || 'Campo obrigatório']"
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

<script setup>
  import AppDataTable from '@/components/AppDataTable/AppDataTable.vue'
  import { collection, getDocs, getFirestore } from 'firebase/firestore'
  import { getAuth, signOut } from 'firebase/auth'
  import { useRouter } from 'vue-router'
  import { onMounted, ref } from 'vue'
  import { required } from '@/validation/rules'

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
    { title: 'Ações', key: 'acoes', align: 'center', sortable: false, width: '200px' },
  ])
  const dialog = ref(false)
  const alimentos = ref([])
  const familiaAlimentos = ref([])
  const tipoAlimentos = ref([])

  const model = ref({})
  const form = ref()

  const db = getFirestore()
  const router = useRouter()
  const auth = getAuth()

  onMounted(async () => {
    getAlimentos()
    getFamilia()
    getTipoAlimento()
  })

  const validForm = async () => {
    const result = await form.value.validate()
    if (await result.valid) {
      salvar()
    }
  }

  const getAlimentos = async () => {
    const getAlimentos = await getDocs(collection(db, 'alimentos'))
    getAlimentos.forEach(doc => {
      alimentos.value.push({ ...doc.data(), id: doc.id })
    })
  }
  const getFamilia = async () => {
    const getAlimentos = await getDocs(collection(db, 'familiaAlimentos'))
    getAlimentos.forEach(doc => {
      familiaAlimentos.value.push({ ...doc.data(), id: doc.id })
    })
  }
  const getTipoAlimento = async () => {
    const getAlimentos = await getDocs(collection(db, 'tiposAlimentos'))
    getAlimentos.forEach(doc => {
      tipoAlimentos.value.push({ ...doc.data(), id: doc.id })
    })
  }

  const logout = async () => {
    signOut(auth)
    router.push('/login')
  }
</script>
