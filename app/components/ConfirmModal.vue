<script setup>
import VueFeather from 'vue-feather'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  confirmText: {
    type: String,
    required: true
  },
  confirmVariant: {
    type: String,
    default: 'danger'
  },
  icon: {
    type: String,
    default: 'alert-triangle'
  },
  iconClass: {
    type: String,
    default: 'text-red-600 bg-red-50 border-red-200'
  }
})

const emit = defineEmits(['close', 'confirm'])
const { t } = useI18n()
</script>

<template>
  <BaseModal 
    :show="show" 
    :showHeader="false" 
    maxWidthClass="max-w-sm" 
    @close="emit('close')"
  >
    <div class="text-center flex flex-col gap-5">
      <!-- Icon -->
      <div 
        class="w-12 h-12 rounded-full flex items-center justify-center mx-auto border-2"
        :class="iconClass"
      >
        <vue-feather :type="icon" size="20"></vue-feather>
      </div>
      
      <!-- Content -->
      <div>
        <h3 class="text-base font-bold text-text-primary">{{ title }}</h3>
        <p v-if="message" class="text-xs text-text-muted mt-2 leading-relaxed">
          {{ message }}
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3 justify-center pt-2">
        <BaseButton 
          variant="outline" 
          class="w-1/2" 
          @click="emit('close')"
        >
          {{ t('cancel') }}
        </BaseButton>
        
        <BaseButton 
          :variant="confirmVariant" 
          class="w-1/2" 
          @click="emit('confirm')"
        >
          {{ confirmText }}
        </BaseButton>
      </div>
    </div>
  </BaseModal>
</template>
