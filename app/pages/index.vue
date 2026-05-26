<script setup>
import VueFeather from 'vue-feather'

const STORAGE_KEY = 'verna_dictionary_words'
const initialWords = []

const words = ref([])
const searchQuery = ref('')
const selectedCategory = ref('Tutti')
const selectedWordId = ref(null)

const { t } = useI18n()

// Modal states
const showFormModal = ref(false)
const wordToEdit = ref(null)

const showDeleteConfirm = ref(false)
const wordToDelete = ref(null)

const categories = ['Tutti', 'Sostantivo', 'Verbo', 'Aggettivo', 'Avverbio', 'Altro']

onMounted(() => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        words.value = JSON.parse(saved)
      } catch (e) {
        words.value = [...initialWords]
      }
    } else {
      words.value = [...initialWords]
      saveToStorage()
    }
  }
})

const saveToStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(words.value))
  }
}

const filteredWords = computed(() => {
  return words.value
    .filter(item => {
      const matchesSearch = item.word.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                            item.definition.toLowerCase().includes(searchQuery.value.toLowerCase())
      const matchesCategory = selectedCategory.value === 'Tutti' || item.category === selectedCategory.value
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => a.word.localeCompare(b.word))
})

const selectedWord = computed(() => {
  return words.value.find(w => w.id === selectedWordId.value) || null
})

// Actions
const openAddForm = () => {
  wordToEdit.value = null
  showFormModal.value = true
}

const openEditForm = (wordObj) => {
  wordToEdit.value = wordObj
  showFormModal.value = true
}

const confirmDelete = (wordObj) => {
  wordToDelete.value = wordObj
  showDeleteConfirm.value = true
}

const saveWord = (formData) => {
  if (wordToEdit.value === null) {
    const newWord = {
      id: Date.now().toString(),
      ...formData
    }
    words.value.push(newWord)
    selectedWordId.value = newWord.id
  } else {
    const idx = words.value.findIndex(w => w.id === wordToEdit.value.id)
    if (idx !== -1) {
      words.value[idx] = {
        ...words.value[idx],
        ...formData
      }
    }
  }
  saveToStorage()
  showFormModal.value = false
}

const deleteWord = () => {
  if (!wordToDelete.value) return
  words.value = words.value.filter(w => w.id !== wordToDelete.value.id)
  saveToStorage()
  if (selectedWordId.value === wordToDelete.value.id) {
    selectedWordId.value = null
  }
  showDeleteConfirm.value = false
  wordToDelete.value = null
}

const showTopShadow = ref(false)
const showBottomShadow = ref(false)
const scrollContainer = ref(null)

const handleScroll = () => {
  if (!scrollContainer.value) return
  const { scrollTop, scrollHeight, clientHeight } = scrollContainer.value
  showTopShadow.value = scrollTop > 2
  showBottomShadow.value = scrollTop + clientHeight < scrollHeight - 2
}

watch(filteredWords, () => {
  nextTick(() => {
    handleScroll()
  })
}, { deep: true })
</script>

<template>
  <div class="flex-1 flex flex-col min-h-0 overflow-hidden bg-bg-base text-text-primary">
    <!-- Header -->
    <header class="border-b-2 border-border-subtle bg-bg-surface px-4 sm:px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl shrink-0 font-sans">
          V
        </div>
        <div>
          <h1 class="text-lg sm:text-xl font-bold text-text-primary leading-tight font-sans">{{ t('title') }}</h1>
          <p class="text-[10px] sm:text-xs text-text-muted font-sans">{{ t('subtitle') }}</p>
        </div>
      </div>

      <div class="flex items-center gap-2 sm:gap-4">
        <span class="hidden sm:inline-flex text-xs text-text-secondary bg-bg-surface-hover border-2 border-border-subtle px-3 py-1 rounded-full font-medium font-sans">
          {{ t('vocabulariesRegistered', { count: words.length }) }}
        </span>
        
        <BaseButton variant="primary" size="sm" class="gap-1.5 sm:gap-2" @click="openAddForm">
          <vue-feather type="plus" size="14"></vue-feather>
          <span class="hidden sm:inline">{{ t('addWord') }}</span>
        </BaseButton>
      </div>
    </header>

    <!-- Main Workspace -->
    <main class="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0 overflow-hidden">
      
      <!-- Sidebar (Search & Word List) -->
      <section class="flex-col gap-4 min-h-0 overflow-hidden" :class="selectedWordId ? 'hidden lg:flex' : 'flex'">
        <!-- Search bar -->
        <div class="relative flex items-center border-2 border-border-subtle bg-bg-surface rounded-full px-4 py-2.5 focus-within:border-primary transition-colors duration-200">
          <vue-feather type="search" size="16" class="text-text-muted"></vue-feather>
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="t('searchPlaceholder')"
            class="w-full bg-transparent outline-none text-sm text-text-secondary pl-2 font-sans"
          />
          <button v-if="searchQuery" @click="searchQuery = ''" class="text-text-muted hover:text-text-primary animate-fade-in cursor-pointer flex items-center">
            <vue-feather type="x" size="16"></vue-feather>
          </button>
        </div>

        <!-- Category Filter Pills -->
        <div class="flex flex-wrap gap-1.5 pb-1">
          <button
            v-for="cat in categories"
            :key="cat"
            @click="selectedCategory = cat"
            class="px-3.5 py-1 text-xs font-medium rounded-full cursor-pointer transition-colors border-2 font-sans"
            :class="selectedCategory === cat 
              ? 'bg-primary text-white border-primary' 
              : 'bg-bg-surface text-text-secondary border-border-subtle hover:border-text-primary hover:text-text-primary'"
          >
            {{ t(cat) }}
          </button>
        </div>

        <!-- Word List Container with fade overlay -->
        <div class="relative flex-1 min-h-0">
          <!-- Dimmed fade overlay at the top -->
          <div 
            class="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-[#fafafa] to-transparent pointer-events-none z-10 transition-opacity duration-300"
            :class="showTopShadow ? 'opacity-100' : 'opacity-0'"
          ></div>
          
          <div 
            ref="scrollContainer"
            @scroll="handleScroll"
            class="h-full flex flex-col gap-2 overflow-y-auto pr-1 pt-2"
          >
            <button
              v-for="item in filteredWords"
              :key="item.id"
              @click="selectedWordId = item.id"
              class="flex items-center justify-between p-4 text-left border-2 animate-fade-in transition-all duration-200"
              :class="selectedWordId === item.id 
                ? 'card border-primary !bg-primary !text-white !cursor-default' 
                : 'card-interactive border-border-subtle bg-bg-surface hover:border-text-primary text-text-primary'"
            >
              <div>
                <span 
                  class="font-bold text-sm block font-sans"
                  :class="selectedWordId === item.id ? '!text-white' : 'text-text-primary'"
                >{{ item.word }}</span>
                <span 
                  class="inline-block mt-1.5 px-2.5 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider font-sans transition-colors duration-200"
                  :class="selectedWordId === item.id 
                    ? 'border-white/30 !text-white/90 !bg-white/10' 
                    : 'border-border-subtle text-text-secondary bg-bg-base'"
                >
                  {{ t(item.category) }}
                </span>
              </div>
              <vue-feather 
                type="chevron-right" 
                size="16" 
                :class="selectedWordId === item.id ? '!text-white' : 'text-text-muted'"
              ></vue-feather>
            </button>

            <!-- Empty State Word List -->
            <div v-if="filteredWords.length === 0" class="card border-dashed text-center p-8 flex flex-col items-center justify-center">
              <vue-feather type="slash" size="24" class="text-text-muted mb-2"></vue-feather>
              <p class="text-xs font-bold text-text-secondary font-sans">{{ t('emptySearchTitle') }}</p>
              <p class="text-[10px] text-text-muted mt-1 font-sans">{{ t('emptySearchSub') }}</p>
            </div>
          </div>
          <!-- Dimmed fade overlay at the bottom -->
          <div 
            class="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#fafafa] to-transparent pointer-events-none transition-opacity duration-300"
            :class="showBottomShadow ? 'opacity-100' : 'opacity-0'"
          ></div>
        </div>
      </section>

      <!-- Main Detail View (Right panel) -->
      <section class="lg:col-span-2 min-h-0 overflow-hidden" :class="!selectedWordId ? 'hidden lg:block' : 'block'">
        <WordDetail 
          :word="selectedWord" 
          @edit="openEditForm" 
          @delete="confirmDelete" 
          @back="selectedWordId = null" 
        />
      </section>

    </main>

    <!-- Word Form Modal (Add / Edit) -->
    <WordFormModal 
      :show="showFormModal" 
      :word="wordToEdit" 
      :existingWords="words"
      @close="showFormModal = false" 
      @save="saveWord" 
    />

    <!-- Generic Confirm Delete Modal -->
    <ConfirmModal 
      :show="showDeleteConfirm" 
      :title="t('deleteTitle')" 
      :message="t('deleteConfirmText', { word: wordToDelete?.word || '' })" 
      :confirmText="t('delete')" 
      confirmVariant="danger" 
      @close="showDeleteConfirm = false" 
      @confirm="deleteWord" 
    />

  </div>
</template>

<style scoped>
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
