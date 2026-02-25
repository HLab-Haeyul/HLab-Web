<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAdminAuth } from '@/composables/useAdminAuth'
import { useLocale } from '@/composables/useLocale'

const route = useRoute()
const router = useRouter()
const { locale, basePath, adminPath } = useLocale()
const { requestSmsCode, loginWithSms, rememberLoginPreference, setRememberLoginPreference } =
  useAdminAuth()

const emailInput = ref('')
const passwordInput = ref('')
const phoneNumberInput = ref('')
const verificationCodeInput = ref('')
const rememberLogin = ref(rememberLoginPreference.value)
const statusMessage = ref('')
const errorMessage = ref('')
const debugCode = ref('')
const isSending = ref(false)
const isVerifying = ref(false)
const smsCooldownSeconds = ref(0)

let smsCooldownTimer: ReturnType<typeof setInterval> | undefined

const copy = computed(() =>
  locale.value === 'en'
    ? {
        heading: 'Admin Login',
        description: 'Verify your phone number with SMS and sign in using JWT.',
        emailLabel: 'Email',
        emailPlaceholder: 'admin@example.com',
        passwordLabel: 'Password',
        passwordPlaceholder: 'Enter your password',
        phoneLabel: 'Phone Number',
        phonePlaceholder: '01012345678',
        sendCode: 'Send Code',
        codeLabel: 'Verification Code',
        codePlaceholder: '6-digit code',
        rememberLabel: 'Keep me signed in for 30 days',
        loginButton: 'Sign In',
        homeButton: 'Back to Home',
        sending: 'Sending...',
        signingIn: 'Signing in...',
        sent: 'A verification code has been sent.',
        invalidPhone: 'Please enter a valid phone number.',
        invalidCode: 'Please enter the verification code.',
        resendIn: 'Resend in',
      }
    : {
        heading: '관리자 로그인',
        description: '휴대폰 SMS 인증 후 JWT 토큰으로 로그인합니다.',
        emailLabel: '이메일',
        emailPlaceholder: 'admin@example.com',
        passwordLabel: '비밀번호',
        passwordPlaceholder: '비밀번호를 입력하세요',
        phoneLabel: '휴대폰 번호',
        phonePlaceholder: '01012345678',
        sendCode: '인증번호 전송',
        codeLabel: '인증번호',
        codePlaceholder: '6자리 인증번호',
        rememberLabel: '이후 로그인 저장 (30일)',
        loginButton: '로그인',
        homeButton: '메인으로',
        sending: '전송 중...',
        signingIn: '로그인 중...',
        sent: '인증번호를 전송했습니다.',
        invalidPhone: '유효한 휴대폰 번호를 입력해주세요.',
        invalidCode: '인증번호를 입력해주세요.',
        resendIn: '재전송 가능까지',
      },
)

const redirectPath = computed(() => {
  const candidate = Array.isArray(route.query.redirect)
    ? route.query.redirect[0]
    : route.query.redirect

  if (typeof candidate === 'string' && candidate.startsWith('/') && !candidate.startsWith('//')) {
    return candidate
  }

  return adminPath.value
})

watch(
  () => rememberLoginPreference.value,
  (nextValue) => {
    rememberLogin.value = nextValue
  },
)

watch(rememberLogin, (nextValue) => {
  setRememberLoginPreference(nextValue)
})

const normalizePhoneNumber = (value: string) => {
  const digits = value.replace(/\D/g, '')

  if (digits.startsWith('82')) {
    const withLocalPrefix = `0${digits.slice(2)}`
    return withLocalPrefix
  }

  return digits
}

const isValidPhoneNumber = (value: string) => /^01\d{8,9}$/.test(value)

const clearSmsCooldown = () => {
  if (smsCooldownTimer) {
    clearInterval(smsCooldownTimer)
    smsCooldownTimer = undefined
  }
}

const startSmsCooldown = (seconds: number) => {
  clearSmsCooldown()
  smsCooldownSeconds.value = Math.max(0, seconds)

  if (smsCooldownSeconds.value <= 0) {
    return
  }

  smsCooldownTimer = setInterval(() => {
    smsCooldownSeconds.value = Math.max(0, smsCooldownSeconds.value - 1)

    if (smsCooldownSeconds.value <= 0) {
      clearSmsCooldown()
    }
  }, 1000)
}

const sendCodeButtonText = computed(() => {
  if (isSending.value) {
    return copy.value.sending
  }

  if (smsCooldownSeconds.value > 0) {
    return `${copy.value.resendIn} ${smsCooldownSeconds.value}s`
  }

  return copy.value.sendCode
})

const handleSendCode = async () => {
  errorMessage.value = ''
  statusMessage.value = ''
  debugCode.value = ''

  const normalizedPhoneNumber = normalizePhoneNumber(phoneNumberInput.value)

  if (!isValidPhoneNumber(normalizedPhoneNumber)) {
    errorMessage.value = copy.value.invalidPhone
    return
  }

  phoneNumberInput.value = normalizedPhoneNumber
  isSending.value = true

  try {
    const result = await requestSmsCode(normalizedPhoneNumber)

    if (!result.ok) {
      errorMessage.value = result.message
      return
    }

    statusMessage.value = result.message || copy.value.sent
    debugCode.value = result.debugCode ?? ''
    startSmsCooldown(result.expiresIn)
  } catch {
    errorMessage.value =
      locale.value === 'en' ? 'Failed to send verification code.' : '인증번호 전송에 실패했습니다.'
  } finally {
    isSending.value = false
  }
}

const handleLogin = async () => {
  errorMessage.value = ''
  statusMessage.value = ''

  const normalizedPhoneNumber = normalizePhoneNumber(phoneNumberInput.value)
  const normalizedCode = verificationCodeInput.value.replace(/\s/g, '')

  if (!isValidPhoneNumber(normalizedPhoneNumber)) {
    errorMessage.value = copy.value.invalidPhone
    return
  }

  if (!normalizedCode) {
    errorMessage.value = copy.value.invalidCode
    return
  }

  phoneNumberInput.value = normalizedPhoneNumber
  verificationCodeInput.value = normalizedCode
  isVerifying.value = true

  try {
    const result = await loginWithSms(normalizedPhoneNumber, normalizedCode, rememberLogin.value)

    if (!result.ok) {
      errorMessage.value = result.message
      return
    }

    await router.replace(redirectPath.value)
  } catch {
    errorMessage.value =
      locale.value === 'en'
        ? 'Login failed. Please try again.'
        : '로그인에 실패했습니다. 다시 시도해주세요.'
  } finally {
    isVerifying.value = false
  }
}

onBeforeUnmount(() => {
  clearSmsCooldown()
})
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
        <p class="mt-2 text-sm text-zinc-400">{{ copy.description }}</p>

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
            />
          </label>

          <label class="block space-y-1">
            <span class="text-xs text-zinc-400">{{ copy.phoneLabel }}</span>
            <div class="flex gap-2">
              <input
                v-model="phoneNumberInput"
                type="tel"
                inputmode="numeric"
                autocomplete="tel"
                :placeholder="copy.phonePlaceholder"
                class="w-full rounded-lg border border-[#2f2f2f] bg-[#151515] px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none"
              />
              <button
                type="button"
                class="shrink-0 rounded-lg border border-blue-500 bg-blue-600 px-3 py-2 text-xs font-medium text-white transition hover:border-blue-400 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="isSending || isVerifying || smsCooldownSeconds > 0"
                @click="handleSendCode"
              >
                {{ sendCodeButtonText }}
              </button>
            </div>
          </label>

          <label class="block space-y-1">
            <span class="text-xs text-zinc-400">{{ copy.codeLabel }}</span>
            <input
              v-model="verificationCodeInput"
              type="text"
              inputmode="numeric"
              autocomplete="one-time-code"
              :placeholder="copy.codePlaceholder"
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
            :disabled="isVerifying || isSending"
            @click="handleLogin"
          >
            {{ isVerifying ? copy.signingIn : copy.loginButton }}
          </button>
        </div>

        <p
          v-if="statusMessage"
          class="mt-3 rounded-lg border border-[#2a3d65] bg-[#14223a] px-3 py-2 text-xs text-blue-200"
        >
          {{ statusMessage }}
        </p>

        <p
          v-if="debugCode"
          class="mt-2 rounded-lg border border-[#5f5544] bg-[#211b12] px-3 py-2 text-xs text-amber-200"
        >
          DEBUG CODE: {{ debugCode }}
        </p>

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
