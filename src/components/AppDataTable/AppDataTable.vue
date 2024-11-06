<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { Header, Paginacao } from './types'
  import { useDisplay } from 'vuetify'

  export interface PaginacaoTable {
    paginacao: Paginacao;
  }

  const emit = defineEmits(['page'])

  const props = defineProps<{
    headers: Header[];
    search?: string;
    items: any;
    totalElements?: number;
    hide: boolean;
    loading?: boolean;
  }>()

  const paginacao = ref({ page: 1, size: 10 } as Paginacao)

  const header = ref(props.headers)

  const totalElementos = computed(() => {
    return props.totalElements
  })

  const tamanhoPaginacao = computed(() => {
    return useDisplay().mdAndUp ? 7 : 5
  })
  const totalPaginas = computed(() => {
    if (!props.items.length) return 1
    return totalElementos.value
      ? Math.ceil(totalElementos.value / paginacao.value.size)
      : Math.ceil(props.items.length / paginacao.value.size)
  })
  const lengthPaginacao = computed(() => {
    return Math.min(tamanhoPaginacao.value, totalPaginas.value)
  })

  watch(
    () => paginacao.value.page,
    val => {
      emit('page', val)
    }
  )
</script>

<template>
  <v-data-table
    v-model:headers="header"
    v-model:items-per-page="paginacao.size"
    class="tabela"
    hide-default-footer
    item-value="name"
    :items="props.items"
    :loading="loading"
    :search="props.search"
  >
    <template v-for="(_, scopedSlotName) in $slots" #[scopedSlotName]="slotData">
      <slot :name="scopedSlotName" v-bind="slotData" />
    </template>
    <template #no-data>
      <p class="text-teste">Nenhum resultado encontrado.</p>
    </template>
  </v-data-table>
  <v-card v-show="!props.hide" class="mt-2 rounded-lg" color="#D9D9D9" variant="outlined">
    <v-row class="row-pagination" no-gutters>
      <v-col class="d-flex justify-start pt-4 pl-3">
        <span class="span-color"> Exibindo </span>
        <span class="span-color-paginacao ml-1 text-decoration-underline font-weight-bold">{{ items.length }}</span>
        <span class="ml-1 span-color">{{ 'de ' + totalElements + ' resultados' }}</span>
      </v-col>
      <v-spacer />
      <v-pagination
        v-model="paginacao.page"
        :active-color="'#374D73'"
        color="#404859"
        :length="totalPaginas"
        :total-visible="lengthPaginacao"
      />
    </v-row>
  </v-card>
</template>
<style src="./styles.scss" />
