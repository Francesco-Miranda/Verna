<script setup>
import VueFeather from 'vue-feather'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  word: {
    type: Object,
    default: null
  },
  existingWords: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'save'])
const { t } = useI18n()

const formWord = ref('')
const formCategory = ref('Sostantivo')
const formDefinition = ref('')
const formExamples = ref('')
const formSynonymsArray = ref([])

const formCategories = ['Sostantivo', 'Verbo', 'Aggettivo', 'Avverbio', 'Altro']

const isDuplicate = computed(() => {
  const currentWordName = formWord.value.trim().toLowerCase()
  const currentCategory = formCategory.value
  return props.existingWords.some(w => {
    if (props.word && w.id === props.word.id) {
      return false
    }
    return w.word.toLowerCase() === currentWordName && w.category === currentCategory
  })
})

const resetForm = () => {
  if (props.word) {
    formWord.value = props.word.word
    formCategory.value = props.word.category
    formDefinition.value = props.word.definition
    formExamples.value = props.word.examples || ''
    formSynonymsArray.value = props.word.synonyms ? props.word.synonyms.split(',').map(s => s.trim()).filter(Boolean) : []
  } else {
    formWord.value = ''
    formCategory.value = 'Sostantivo'
    formDefinition.value = ''
    formExamples.value = ''
    formSynonymsArray.value = []
  }
}

watch(() => props.show, (newShow) => {
  if (newShow) {
    resetForm()
  }
})

watch(() => props.word, () => {
  resetForm()
}, { immediate: true })

const handleSave = () => {
  if (!formWord.value.trim() || !formDefinition.value.trim() || isDuplicate.value) return
  emit('save', {
    word: formWord.value.trim(),
    category: formCategory.value,
    definition: formDefinition.value.trim(),
    examples: formExamples.value.trim(),
    synonyms: formSynonymsArray.value.join(', ')
  })
}
</script>

<template>
  <BaseModal 
    :show="show" 
    :title="word ? t('modalEditTitle') : t('modalAddTitle')" 
    @close="emit('close')"
  >
    <!-- Header Icon Slot -->
    <template #header-icon>
      <vue-feather :type="word ? 'edit-3' : 'plus-circle'" size="18" class="text-primary"></vue-feather>
    </template>

    <!-- Modal Form Body -->
    <div class="flex flex-col gap-5">
      <!-- Word Name + Category Row -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- Word Name -->
        <div class="flex flex-col gap-2">
          <label class="text-xs font-bold text-text-secondary font-sans flex items-center gap-1.5">
            <vue-feather type="type" size="13" class="text-text-muted"></vue-feather>
            {{ t('wordLabel') }}
          </label>
          <input
            v-model="formWord"
            type="text"
            :placeholder="t('wordPlaceholder')"
            class="border-2 border-border-subtle bg-bg-base rounded-xl px-4 py-2.5 outline-none focus:border-primary text-sm text-text-primary font-sans transition-colors duration-200"
          />
        </div>

        <!-- Category Select -->
        <div class="flex flex-col gap-2 relative">
          <label class="text-xs font-bold text-text-secondary font-sans flex items-center gap-1.5">
            <vue-feather type="tag" size="13" class="text-text-muted"></vue-feather>
            {{ t('categoryLabel') }}
          </label>
          <BaseSelect v-model="formCategory" :options="formCategories" />
        </div>
      </div>

      <!-- Warning alert if duplicate -->
      <div v-if="isDuplicate" class="flex items-center gap-2.5 bg-amber-50 border-2 border-amber-200 text-amber-800 text-xs rounded-xl px-4 py-3 font-sans animate-fade-in">
        <vue-feather type="alert-circle" size="15" class="shrink-0 text-amber-500"></vue-feather>
        <span class="font-medium">{{ t('wordAlreadyExists') }}</span>
      </div>

      <!-- Definition -->
      <div class="flex flex-col gap-2">
        <label class="text-xs font-bold text-text-secondary font-sans flex items-center gap-1.5">
          <vue-feather type="file-text" size="13" class="text-text-muted"></vue-feather>
          {{ t('definitionLabel') }}
        </label>
        <textarea
          v-model="formDefinition"
          rows="3"
          :placeholder="t('definitionPlaceholder')"
          class="border-2 border-border-subtle bg-bg-base rounded-xl px-4 py-2.5 outline-none focus:border-primary text-sm text-text-primary resize-none font-sans transition-colors duration-200"
        ></textarea>
      </div>

      <!-- Optional Fields Separator -->
      <div class="flex items-center gap-3">
        <hr class="flex-1 border-t-2 border-border-subtle" />
        <span class="text-[10px] font-bold uppercase tracking-wider text-text-muted font-sans">{{ t('optionalLabel') || 'Opzionale' }}</span>
        <hr class="flex-1 border-t-2 border-border-subtle" />
      </div>

      <!-- Examples -->
      <div class="flex flex-col gap-2">
        <label class="text-xs font-bold text-text-secondary font-sans flex items-center gap-1.5">
          <vue-feather type="message-square" size="13" class="text-text-muted"></vue-feather>
          {{ t('examplesOptionalLabel') }}
        </label>
        <textarea
          v-model="formExamples"
          rows="2"
          :placeholder="t('examplesPlaceholder')"
          class="border-2 border-border-subtle bg-bg-base rounded-xl px-4 py-2.5 outline-none focus:border-primary text-sm text-text-primary resize-none font-sans transition-colors duration-200"
        ></textarea>
      </div>

      <!-- Synonyms TagsInput -->
      <div class="flex flex-col gap-2">
        <label class="text-xs font-bold text-text-secondary font-sans flex items-center gap-1.5">
          <vue-feather type="layers" size="13" class="text-text-muted"></vue-feather>
          {{ t('synonymsOptionalLabel') }}
        </label>
        <TagsInput v-model="formSynonymsArray" :placeholder="t('synonymsPlaceholder')" />
      </div>
    </div>

    <!-- Modal Footer Slot -->
    <template #footer>
      <BaseButton variant="outline" @click="emit('close')">
        {{ t('cancel') }}
      </BaseButton>
      
      <BaseButton 
        variant="secondary" 
        :disabled="!formWord.trim() || !formDefinition.trim() || isDuplicate"
        @click="handleSave"
      >
        {{ t('save') }}
      </BaseButton>
    </template>
  </BaseModal>
</template>
