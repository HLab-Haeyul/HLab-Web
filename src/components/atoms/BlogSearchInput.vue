<script setup lang="ts">
type Props = {
  label: string
  placeholder: string
  inputId?: string
}

const props = withDefaults(defineProps<Props>(), {
  inputId: 'blog-search-input',
})

const model = defineModel<string>({ default: '' })
</script>

<template>
  <section class="space-y-2">
    <label class="text-xs font-medium text-zinc-500" :for="props.inputId">{{ props.label }}</label>
    <input
      :id="props.inputId"
      v-model="model"
      type="search"
      :placeholder="props.placeholder"
      class="w-full rounded-lg border border-[#2f2f2f] bg-[#141414] px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-[#5a5a5a] focus:outline-none"
    />
  </section>
</template>
