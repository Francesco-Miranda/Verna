<script setup>
import VueFeather from 'vue-feather'

const props = defineProps({
  word: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['edit', 'delete', 'back'])
const { t } = useI18n()
</script>

<template>
  <div class="h-full">
    <!-- Not Selected State -->
    <div v-if="!word" class="card border-dashed flex flex-col items-center justify-center text-center p-12 h-full">
      <div class="w-16 h-16 squircle bg-border-subtle p-[2px] mb-4">
        <div class="w-full h-full squircle bg-bg-surface-hover text-text-secondary flex items-center justify-center">
          <vue-feather type="book-open" size="24"></vue-feather>
        </div>
      </div>
      <h3 class="text-base font-bold text-text-primary">{{ t('emptyDetailTitle') }}</h3>
      <p class="text-xs text-text-muted max-w-xs mt-1 leading-relaxed">
        {{ t('emptyDetailSub') }}
      </p>
    </div>

    <!-- Selected Word Detail View -->
    <div v-else class="card flex flex-col gap-6 border-2 border-border-subtle h-full overflow-y-auto">
      <div class="flex justify-between items-start gap-4">
        <div class="flex items-start gap-3">
          <!-- Back button -->
          <BaseButton variant="outline" size="sm" class="lg:!hidden shrink-0 mt-1 px-3 py-1.5" @click="emit('back')"
            :title="t('backToList')">
            <vue-feather type="arrow-left" size="14"></vue-feather>
          </BaseButton>

          <div>
            <h2
              class="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary break-all leading-tight font-sans">
              {{ word.word }}</h2>
            <span
              class="inline-block mt-2 px-3 py-0.5 rounded-full border-2 border-border-subtle text-[10px] font-bold uppercase tracking-wider text-text-secondary bg-bg-base font-sans">
              {{ t(word.category) }}
            </span>
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <BaseButton variant="secondary" size="sm" class="gap-1.5 px-3 sm:px-4 py-1.5" @click="emit('edit')">
            <vue-feather type="edit-2" size="12"></vue-feather>
            <span class="hidden sm:inline">{{ t('edit') }}</span>
          </BaseButton>

          <BaseButton variant="danger" size="sm" class="gap-1.5 px-3 sm:px-4 py-1.5" @click="emit('delete')">
            <vue-feather type="trash-2" size="12"></vue-feather>
            <span class="hidden sm:inline">{{ t('delete') }}</span>
          </BaseButton>
        </div>
      </div>

      <hr class="border-border-subtle border-t-2" />

      <!-- Definition Section -->
      <div class="flex flex-col gap-2">
        <span class="text-[10px] font-bold uppercase tracking-wider text-text-muted font-sans">{{ t('definitionLabel')
          }}</span>
        <p class="text-sm text-text-secondary leading-relaxed pl-1 font-sans">
          {{ word.definition }}
        </p>
      </div>

      <!-- Examples Section -->
      <div v-if="word.examples" class="flex flex-col gap-2">
        <span class="text-[10px] font-bold uppercase tracking-wider text-text-muted font-sans">{{ t('examplesLabel')
          }}</span>
        <div
          class="border-l-4 border-primary pl-4 py-1 italic text-xs text-text-secondary bg-bg-base/40 rounded-r-lg font-sans">
          {{ word.examples }}
        </div>
      </div>

      <!-- Synonyms Section -->
      <div v-if="word.synonyms" class="flex flex-col gap-2">
        <span class="text-[10px] font-bold uppercase tracking-wider text-text-muted font-sans">{{ t('synonymsLabel')
          }}</span>
        <div class="flex flex-wrap gap-2 mt-1">
          <span v-for="syn in word.synonyms.split(',')" :key="syn"
            class="text-xs bg-bg-surface-hover border-2 border-border-subtle px-3 py-1 rounded-full text-text-secondary font-medium font-sans">
            {{ syn.trim() }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
