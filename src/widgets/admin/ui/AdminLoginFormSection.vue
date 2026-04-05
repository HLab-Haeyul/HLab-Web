<script setup lang="ts">
const props = defineProps<{
  heading: string
  emailLabel: string
  emailPlaceholder: string
  passwordLabel: string
  passwordPlaceholder: string
  rememberLabel: string
  loginButton: string
  homeButton: string
  signingIn: string
  errorMessage: string
  basePath: string
  isVerifying: boolean
  emailInput: string
  passwordInput: string
  rememberLogin: boolean
}>()

const emit = defineEmits<{
  (event: 'update:email-input', value: string): void
  (event: 'update:password-input', value: string): void
  (event: 'update:remember-login', value: boolean): void
  (event: 'submit'): void
}>()
</script>

<template>
  <main class="mx-auto flex min-h-[70vh] w-full max-w-[540px] items-center">
    <section class="rounded-[1.4rem] border border-[#2a2a2a] bg-[#101010db] p-5 sm:p-7">
      <p class="text-xs uppercase tracking-[0.12em] text-[var(--text-soft)]">ADMIN AUTH</p>
      <h1 class="mt-2 text-2xl font-semibold text-zinc-100 sm:text-3xl">{{ props.heading }}</h1>

      <div class="mt-5 space-y-4">
        <label class="block space-y-1">
          <span class="text-xs text-zinc-400">{{ props.emailLabel }}</span>
          <input
            :value="props.emailInput"
            type="email"
            autocomplete="email"
            :placeholder="props.emailPlaceholder"
            class="w-full rounded-lg border border-[#2f2f2f] bg-[#151515] px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none"
            @input="emit('update:email-input', ($event.target as HTMLInputElement).value)"
          />
        </label>

        <label class="block space-y-1">
          <span class="text-xs text-zinc-400">{{ props.passwordLabel }}</span>
          <input
            :value="props.passwordInput"
            type="password"
            autocomplete="current-password"
            :placeholder="props.passwordPlaceholder"
            class="w-full rounded-lg border border-[#2f2f2f] bg-[#151515] px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none"
            @input="emit('update:password-input', ($event.target as HTMLInputElement).value)"
            @keydown.enter.prevent="emit('submit')"
          />
        </label>

        <label class="inline-flex items-center gap-2 text-sm text-zinc-300">
          <input
            :checked="props.rememberLogin"
            type="checkbox"
            class="h-4 w-4 rounded border-[#3a3a3a] bg-[#151515] text-blue-500 focus:ring-blue-500"
            @change="emit('update:remember-login', ($event.target as HTMLInputElement).checked)"
          />
          {{ props.rememberLabel }}
        </label>

        <button
          type="button"
          class="w-full rounded-lg border border-blue-500 bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:border-blue-400 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="props.isVerifying"
          @click="emit('submit')"
        >
          {{ props.isVerifying ? props.signingIn : props.loginButton }}
        </button>
      </div>

      <p
        v-if="props.errorMessage"
        class="mt-3 rounded-lg border border-[#5e2b2b] bg-[#2a1414] px-3 py-2 text-xs text-rose-300"
      >
        {{ props.errorMessage }}
      </p>

      <RouterLink
        :to="props.basePath"
        class="mt-5 inline-flex items-center rounded-lg border border-[#3a3a3a] px-3 py-1.5 text-xs text-zinc-200 transition hover:border-[#5a5a5a] hover:text-white"
      >
        {{ props.homeButton }}
      </RouterLink>
    </section>
  </main>
</template>
