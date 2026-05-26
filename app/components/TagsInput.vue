<script setup>
import VueFeather from 'vue-feather'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const inputText = ref('')

const handleInput = () => {
  if (inputText.value.includes(',')) {
    const parts = inputText.value.split(',')
    const currentTags = [...props.modelValue]
    let updated = false

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i].trim()
      if (part && !currentTags.includes(part)) {
        currentTags.push(part)
        updated = true
      }
    }
    
    if (updated) {
      emit('update:modelValue', currentTags)
    }
    inputText.value = parts[parts.length - 1]
  }
}

const addTag = () => {
  const val = inputText.value.trim().replace(/,$/, '').trim()
  if (val && !props.modelValue.includes(val)) {
    emit('update:modelValue', [...props.modelValue, val])
  }
  inputText.value = ''
}

const removeTag = (index) => {
  const currentTags = [...props.modelValue]
  currentTags.splice(index, 1)
  emit('update:modelValue', currentTags)
}

const handleBackspace = () => {
  if (inputText.value === '' && props.modelValue.length > 0) {
    const currentTags = [...props.modelValue]
    currentTags.pop()
    emit('update:modelValue', currentTags)
  }
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-2 border-2 border-border-subtle bg-bg-base rounded-xl p-2 focus-within:border-primary transition-colors duration-200">
    <span 
      v-for="(tag, index) in modelValue" 
      :key="index"
      class="inline-flex items-center gap-1.5 bg-bg-surface border border-border-subtle px-3.5 py-1.5 rounded-full text-sm text-text-primary font-medium font-sans"
    >
      {{ tag }}
      <button @click="removeTag(index)" type="button" class="text-text-muted hover:text-accent cursor-pointer flex items-center">
        <vue-feather type="x" size="14"></vue-feather>
      </button>
    </span>
    
    <input
      v-model="inputText"
      @input="handleInput"
      @keydown.prevent.enter="addTag"
      @keydown.backspace="handleBackspace"
      @blur="addTag"
      type="text"
      :placeholder="modelValue.length === 0 ? placeholder : ''"
      class="flex-1 min-w-[120px] bg-transparent outline-none text-sm text-text-primary py-0.5 px-1 font-sans"
    />
  </div>
</template>
