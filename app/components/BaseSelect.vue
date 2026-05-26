<script setup>
import VueFeather from 'vue-feather'

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  options: {
    type: Array,
    required: true
  },
  placeholder: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])
const { t } = useI18n()

const isOpen = ref(false)
const dropdownRef = ref(null)
const triggerRef = ref(null)
const listRef = ref(null)

const getOptionButtons = () => {
  if (!listRef.value) return []
  return Array.from(listRef.value.querySelectorAll('button'))
}

const focusOption = (index) => {
  const buttons = getOptionButtons()
  if (buttons[index]) {
    buttons[index].focus()
  }
}

const toggle = () => {
  if (isOpen.value) {
    closeDropdown()
  } else {
    isOpen.value = true
    nextTick(() => {
      const selectedIdx = props.options.findIndex(opt => {
        const value = typeof opt === 'object' ? opt.value : opt
        return value === props.modelValue
      })
      focusOption(selectedIdx >= 0 ? selectedIdx : 0)
    })
  }
}

const closeDropdown = () => {
  isOpen.value = false
  nextTick(() => {
    triggerRef.value?.focus()
  })
}

const selectOption = (opt) => {
  const value = typeof opt === 'object' ? opt.value : opt
  emit('update:modelValue', value)
  closeDropdown()
}

const getLabel = (opt) => {
  const value = typeof opt === 'object' ? opt.value : opt
  return t(value)
}

const getSelectedLabel = () => {
  const selected = props.options.find(opt => {
    const value = typeof opt === 'object' ? opt.value : opt
    return value === props.modelValue
  })
  if (selected) {
    return getLabel(selected)
  }
  return props.placeholder || t(props.modelValue)
}

const handleOptionKeydown = (e, opt, index) => {
  const total = props.options.length

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      focusOption((index + 1) % total)
      break
    case 'ArrowUp':
      e.preventDefault()
      focusOption((index - 1 + total) % total)
      break
    case 'Tab':
      e.preventDefault()
      if (e.shiftKey) {
        focusOption((index - 1 + total) % total)
      } else {
        focusOption((index + 1) % total)
      }
      break
    case 'Enter':
    case ' ':
      e.preventDefault()
      selectOption(opt)
      break
    case 'Escape':
      e.preventDefault()
      closeDropdown()
      break
  }
}

const handleTriggerKeydown = (e) => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
    if (!isOpen.value) {
      e.preventDefault()
      toggle()
    }
  }
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div ref="dropdownRef" class="relative">
    <button ref="triggerRef" @click="toggle" @keydown="handleTriggerKeydown" type="button"
      class="w-full flex items-center justify-between border-2 border-border-subtle bg-bg-base rounded-xl px-4 py-2.5 outline-none focus:border-primary text-sm text-text-primary text-left cursor-pointer transition-colors duration-200">
      <span>{{ getSelectedLabel() }}</span>
      <vue-feather type="chevron-down" size="14" class="text-text-muted transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"></vue-feather>
    </button>

    <div v-if="isOpen" ref="listRef"
      class="absolute left-0 right-0 mt-1.5 bg-bg-surface border-2 border-border-subtle rounded-2xl shadow-xl z-20 overflow-hidden"
      role="listbox">
      <button v-for="(opt, index) in options" :key="typeof opt === 'object' ? opt.value : opt"
        @click="selectOption(opt)" @keydown="handleOptionKeydown($event, opt, index)" type="button" role="option"
        :aria-selected="modelValue === (typeof opt === 'object' ? opt.value : opt)"
        class="w-full text-left px-4 py-2.5 text-sm hover:bg-bg-surface-hover focus:bg-bg-surface-hover text-text-primary transition-colors cursor-pointer flex items-center justify-between outline-none"
        :class="{ 'bg-bg-base font-bold': modelValue === (typeof opt === 'object' ? opt.value : opt) }">
        <span>{{ getLabel(opt) }}</span>
        <vue-feather v-if="modelValue === (typeof opt === 'object' ? opt.value : opt)" type="check" size="14"
          class="text-primary"></vue-feather>
      </button>
    </div>
  </div>
</template>
