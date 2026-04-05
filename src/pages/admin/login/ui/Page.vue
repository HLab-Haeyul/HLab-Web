<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useAdminAuth } from '@/features/auth/admin-session'
import { AdminLoginFormSection } from '@/widgets/admin'
import { useLocale } from '@/shared/lib/routing'
import PublicPageLayout from '@/widgets/public-layout'

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
  <PublicPageLayout width="narrow" top-spacing="compact">
    <AdminLoginFormSection
      :heading="copy.heading"
      :email-label="copy.emailLabel"
      :email-placeholder="copy.emailPlaceholder"
      :password-label="copy.passwordLabel"
      :password-placeholder="copy.passwordPlaceholder"
      :remember-label="copy.rememberLabel"
      :login-button="copy.loginButton"
      :home-button="copy.homeButton"
      :signing-in="copy.signingIn"
      :error-message="errorMessage"
      :base-path="basePath"
      :is-verifying="isVerifying"
      :email-input="emailInput"
      :password-input="passwordInput"
      :remember-login="rememberLogin"
      @update:email-input="emailInput = $event"
      @update:password-input="passwordInput = $event"
      @update:remember-login="rememberLogin = $event"
      @submit="handleLogin"
    />
  </PublicPageLayout>
</template>
