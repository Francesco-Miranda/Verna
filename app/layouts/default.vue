<script setup>
const { t } = useI18n()
</script>

<template>
  <div class="h-screen flex flex-col bg-bg-base text-text-primary overflow-hidden">
    <!-- Page Content -->
    <div class="flex-1 flex flex-col min-h-0 overflow-hidden">
      <slot />
    </div>

    <!-- Fixed Layout Footer -->
    <footer class="border-t-2 border-border-subtle py-4 px-6 text-center text-xs text-text-muted bg-bg-surface/30 shrink-0">
      <p>{{ t('footerText') }}</p>
    </footer>
  </div>
</template>
