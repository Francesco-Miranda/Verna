<script setup>
import VueFeather from 'vue-feather'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  maxWidthClass: {
    type: String,
    default: 'max-w-lg'
  },
  showHeader: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close'])

const modalRef = ref(null)
const previouslyFocused = ref(null)

const getFocusableElements = () => {
  if (!modalRef.value) return []
  return Array.from(
    modalRef.value.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  ).filter(el => !el.disabled && el.offsetParent !== null)
}

const handleKeydown = (e) => {
  if (!props.show) return

  if (e.key === 'Escape') {
    emit('close')
    return
  }

  if (e.key === 'Tab') {
    const focusable = getFocusableElements()
    if (focusable.length === 0) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault()
        last.focus()
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }
}

watch(() => props.show, (isOpen) => {
  if (isOpen) {
    previouslyFocused.value = document.activeElement
    nextTick(() => {
      const focusable = getFocusableElements()
      if (focusable.length > 0) {
        focusable[0].focus()
      }
    })
  } else {
    if (previouslyFocused.value) {
      previouslyFocused.value.focus()
      previouslyFocused.value = null
    }
  }
})

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div 
      v-if="show" 
      class="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="emit('close')"
      role="dialog"
      aria-modal="true"
    >
      <div 
        ref="modalRef"
        class="bg-bg-surface border-2 border-border-subtle rounded-3xl w-full p-6 shadow-xl flex flex-col gap-5"
        :class="maxWidthClass"
      >
        <!-- Modal Header -->
        <div v-if="showHeader" class="flex items-center justify-between border-b-2 border-border-subtle pb-4">
          <slot name="header">
            <h3 class="text-lg font-bold flex items-center gap-2">
              <slot name="header-icon" />
              {{ title }}
            </h3>
          </slot>
          <button 
            @click="emit('close')" 
            class="w-8 h-8 rounded-full text-text-muted hover:bg-bg-surface-hover hover:text-text-primary flex items-center justify-center transition-colors duration-200 cursor-pointer"
          >
            <vue-feather type="x" size="16"></vue-feather>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="flex flex-col gap-4">
          <slot />
        </div>

        <!-- Modal Footer -->
        <div v-if="$slots.footer" class="flex justify-end gap-3 border-t-2 border-border-subtle pt-4 mt-2">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>
