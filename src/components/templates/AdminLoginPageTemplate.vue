<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useAdminAuth } from '@/composables/useAdminAuth'
import { useLocale } from '@/composables/useLocale'

const { locale, basePath } = useLocale()
const { rememberLoginPreference, setRememberLoginPreference } = useAdminAuth()

const emailInput = ref('')
const passwordInput = ref('')
const rememberLogin = ref(rememberLoginPreference.value)
const errorMessage = ref('')
const isVerifying = ref(false)

const copy = computed(() =>
  locale.value === 'en'
    ? {
        heading: 'Admin Login',
        emailLabel: 'Email',
        emailPlaceholder: 'admin@example.com',
        passwordLabel: 'Password',
        passwordPlaceholder: 'Enter your password',
        rememberLabel: 'Keep me signed in for 30 days',
        loginButton: 'Sign In',
        homeButton: 'Back to Home',
        signingIn: 'Checking...',
        invalidEmail: 'Please enter your email.',
        invalidPassword: 'Please enter your password.',
        unsupportedLogin:
          'Email/password admin login is not connected on the frontend yet.',
      }
    : {
        heading: '관리자 로그인',
        emailLabel: '이메일',
        emailPlaceholder: 'admin@example.com',
        passwordLabel: '비밀번호',
        passwordPlaceholder: '비밀번호를 입력하세요',
        rememberLabel: '이후 로그인 저장 (30일)',
        loginButton: '로그인',
        homeButton: '메인으로',
        signingIn: '확인 중...',
        invalidEmail: '이메일을 입력해주세요.',
        invalidPassword: '비밀번호를 입력해주세요.',
        unsupportedLogin: '현재 프론트엔드에는 이메일/비밀번호 관리자 로그인 API가 연결되지 않았습니다.',
      },
)

watch(
  () => rememberLoginPreference.value,
  (nextValue) => {
    rememberLogin.value = nextValue
  },
)

watch(rememberLogin, (nextValue) => {
  setRememberLoginPreference(nextValue)
})

const handleLogin = async () => {
  errorMessage.value = ''

  if (!emailInput.value.trim()) {
    errorMessage.value = copy.value.invalidEmail
    return
  }

  if (!passwordInput.value.trim()) {
    errorMessage.value = copy.value.invalidPassword
    return
  }

  isVerifying.value = true

  try {
    errorMessage.value = copy.value.unsupportedLogin
  } finally {
    isVerifying.value = false
  }
}
</script>

<template>
  <div
    class="relative isolate mx-auto flex min-h-screen w-full max-w-[1480px] items-center justify-center px-4 py-10 sm:px-8 lg:px-12"
  >
    <div
      aria-hidden="true"
      class="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_16%_-8%,rgba(59,130,246,0.18),transparent_34%),radial-gradient(circle_at_84%_112%,rgba(59,130,246,0.1),transparent_30%)] [mask-image:linear-gradient(180deg,rgba(0,0,0,0.9),rgba(0,0,0,0.36))]"
    ></div>

    <main class="mx-auto w-full max-w-[540px]">
      <section class="rounded-[1.4rem] border border-[#2a2a2a] bg-[#101010db] p-5 sm:p-7">
        <p class="text-xs uppercase tracking-[0.12em] text-blue-300">ADMIN AUTH</p>
        <h1 class="mt-2 text-2xl font-semibold text-zinc-100 sm:text-3xl">{{ copy.heading }}</h1>

        <div class="mt-5 space-y-4">
          <label class="block space-y-1">
            <span class="text-xs text-zinc-400">{{ copy.emailLabel }}</span>
            <input
              v-model="emailInput"
              type="email"
              autocomplete="email"
              :placeholder="copy.emailPlaceholder"
              class="w-full rounded-lg border border-[#2f2f2f] bg-[#151515] px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none"
            />
          </label>

          <label class="block space-y-1">
            <span class="text-xs text-zinc-400">{{ copy.passwordLabel }}</span>
            <input
              v-model="passwordInput"
              type="password"
              autocomplete="current-password"
              :placeholder="copy.passwordPlaceholder"
              class="w-full rounded-lg border border-[#2f2f2f] bg-[#151515] px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none"
              @keydown.enter.prevent="handleLogin"
            />
          </label>

          <label class="inline-flex items-center gap-2 text-sm text-zinc-300">
            <input
              v-model="rememberLogin"
              type="checkbox"
              class="h-4 w-4 rounded border-[#3a3a3a] bg-[#151515] text-blue-500 focus:ring-blue-500"
            />
            {{ copy.rememberLabel }}
          </label>

          <button
            type="button"
            class="w-full rounded-lg border border-blue-500 bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:border-blue-400 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="isVerifying"
            @click="handleLogin"
          >
            {{ isVerifying ? copy.signingIn : copy.loginButton }}
          </button>
        </div>

        <p
          v-if="errorMessage"
          class="mt-3 rounded-lg border border-[#5e2b2b] bg-[#2a1414] px-3 py-2 text-xs text-rose-300"
        >
          {{ errorMessage }}
        </p>

        <RouterLink
          :to="basePath"
          class="mt-5 inline-flex items-center rounded-lg border border-[#3a3a3a] px-3 py-1.5 text-xs text-zinc-200 transition hover:border-[#5a5a5a] hover:text-white"
        >
          {{ copy.homeButton }}
        </RouterLink>
      </section>
    </main>
  </div>
</template>
