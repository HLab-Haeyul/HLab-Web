<script setup lang="ts">
type WorkOption = {
  title: string
}

type Props = {
  label: string
  placeholder: string
  works: WorkOption[]
  selectedIndex: number | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  change: [value: string]
}>()
</script>

<template>
  <div class="space-y-2">
    <label class="text-xs font-medium text-zinc-500" for="retrospective-project-select">
      {{ props.label }}
    </label>
    <select
      id="retrospective-project-select"
      :value="props.selectedIndex === null ? '' : String(props.selectedIndex)"
      class="w-full rounded-lg border border-[#2f2f2f] bg-[#141414] px-3 py-2 text-sm text-zinc-100 focus:border-[#5a5a5a] focus:outline-none"
      @change="emit('change', ($event.target as HTMLSelectElement).value)"
    >
      <option value="">{{ props.placeholder }}</option>
      <option
        v-for="(work, workIndex) in props.works"
        :key="`retrospective-work-${work.title}`"
        :value="String(workIndex)"
      >
        {{ work.title }}
      </option>
    </select>
  </div>
</template>
