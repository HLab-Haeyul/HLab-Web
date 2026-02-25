import { computed, ref } from 'vue'
import {
  fetchAdminMe,
  logoutAdminSession,
  refreshAdminSession,
  sendSmsCode,
  type SmsSendResult,
  type SmsVerifyResult,
  verifySmsCode,
} from '@/services/authApi'

const ACCESS_TOKEN_STORAGE_KEY = 'hlab_admin_access_token'
const ACCESS_TOKEN_EXPIRES_AT_STORAGE_KEY = 'hlab_admin_access_token_expires_at'
const ACCESS_TOKEN_PHONE_STORAGE_KEY = 'hlab_admin_access_token_phone'
const REMEMBER_LOGIN_STORAGE_KEY = 'hlab_admin_remember_login'
const TOKEN_EXPIRY_SKEW_MS = 10_000

const accessToken = ref<string | null>(null)
const accessTokenExpiresAtMs = ref<number | null>(null)
const adminPhoneNumber = ref<string | null>(null)
const rememberLoginPreference = ref(false)
const initialized = ref(false)

let refreshPromise: Promise<boolean> | null = null

const hasWindow = () => typeof window !== 'undefined'

const clearSessionStorage = () => {
  if (!hasWindow()) {
    return
  }

  window.sessionStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY)
  window.sessionStorage.removeItem(ACCESS_TOKEN_EXPIRES_AT_STORAGE_KEY)
  window.sessionStorage.removeItem(ACCESS_TOKEN_PHONE_STORAGE_KEY)
}

const persistSessionStorage = () => {
  if (!hasWindow()) {
    return
  }

  if (!accessToken.value || !accessTokenExpiresAtMs.value || !adminPhoneNumber.value) {
    clearSessionStorage()
    return
  }

  window.sessionStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken.value)
  window.sessionStorage.setItem(
    ACCESS_TOKEN_EXPIRES_AT_STORAGE_KEY,
    String(accessTokenExpiresAtMs.value),
  )
  window.sessionStorage.setItem(ACCESS_TOKEN_PHONE_STORAGE_KEY, adminPhoneNumber.value)
}

const setRememberLogin = (nextValue: boolean) => {
  rememberLoginPreference.value = nextValue

  if (!hasWindow()) {
    return
  }

  window.localStorage.setItem(REMEMBER_LOGIN_STORAGE_KEY, nextValue ? '1' : '0')
}

const loadRememberLogin = () => {
  if (!hasWindow()) {
    return
  }

  rememberLoginPreference.value =
    window.localStorage.getItem(REMEMBER_LOGIN_STORAGE_KEY) === '1'
}

const clearSession = () => {
  accessToken.value = null
  accessTokenExpiresAtMs.value = null
  adminPhoneNumber.value = null
  clearSessionStorage()
}

const setSessionFromPayload = (payload: {
  accessToken: string
  expiresAt: string
  phoneNumber: string
}) => {
  const expiresAtMs = Date.parse(payload.expiresAt)

  if (!Number.isFinite(expiresAtMs)) {
    clearSession()
    return false
  }

  accessToken.value = payload.accessToken
  accessTokenExpiresAtMs.value = expiresAtMs
  adminPhoneNumber.value = payload.phoneNumber
  persistSessionStorage()
  return true
}

const hydrate = () => {
  if (initialized.value) {
    return
  }

  loadRememberLogin()

  if (!hasWindow()) {
    initialized.value = true
    return
  }

  const storedAccessToken = window.sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)
  const storedExpiresAtMs = Number(
    window.sessionStorage.getItem(ACCESS_TOKEN_EXPIRES_AT_STORAGE_KEY) ?? '',
  )
  const storedPhoneNumber = window.sessionStorage.getItem(ACCESS_TOKEN_PHONE_STORAGE_KEY)

  if (
    storedAccessToken &&
    Number.isFinite(storedExpiresAtMs) &&
    storedExpiresAtMs > 0 &&
    storedPhoneNumber
  ) {
    accessToken.value = storedAccessToken
    accessTokenExpiresAtMs.value = storedExpiresAtMs
    adminPhoneNumber.value = storedPhoneNumber
  } else {
    clearSessionStorage()
  }

  initialized.value = true
}

const isAccessTokenValid = () => {
  if (!accessToken.value || !accessTokenExpiresAtMs.value) {
    return false
  }

  const now = Date.now()
  return accessTokenExpiresAtMs.value - TOKEN_EXPIRY_SKEW_MS > now
}

export const getAdminAccessToken = () => {
  hydrate()

  if (!isAccessTokenValid()) {
    return null
  }

  return accessToken.value
}

export const requestAdminSmsCode = (phoneNumber: string): Promise<SmsSendResult> =>
  sendSmsCode(phoneNumber)

export const loginAdminWithSms = async (
  phoneNumber: string,
  verificationCode: string,
  rememberLogin: boolean,
): Promise<SmsVerifyResult> => {
  hydrate()
  const result = await verifySmsCode(phoneNumber, verificationCode, rememberLogin)

  if (!result.ok) {
    return result
  }

  setRememberLogin(rememberLogin)
  const applied = setSessionFromPayload({
    accessToken: result.session.accessToken,
    expiresAt: result.session.expiresAt,
    phoneNumber: result.session.phoneNumber,
  })

  if (!applied) {
    return {
      ok: false,
      status: 500,
      message: '인증 세션을 저장할 수 없습니다.',
    }
  }

  return result
}

export const ensureAdminAuthenticated = async () => {
  hydrate()

  if (isAccessTokenValid()) {
    return true
  }

  clearSession()

  if (refreshPromise) {
    return refreshPromise
  }

  refreshPromise = (async () => {
    const refreshed = await refreshAdminSession()

    if (!refreshed) {
      clearSession()
      return false
    }

    const applied = setSessionFromPayload({
      accessToken: refreshed.accessToken,
      expiresAt: refreshed.expiresAt,
      phoneNumber: refreshed.phoneNumber,
    })

    if (!applied) {
      clearSession()
      return false
    }

    return true
  })()

  try {
    return await refreshPromise
  } finally {
    refreshPromise = null
  }
}

export const loadAdminProfile = async () => {
  const token = getAdminAccessToken()

  if (!token) {
    return null
  }

  const profile = await fetchAdminMe(token)

  if (!profile) {
    return null
  }

  adminPhoneNumber.value = profile.phoneNumber
  persistSessionStorage()
  return profile
}

export const logoutAdmin = async () => {
  const token = accessToken.value
  clearSession()
  await logoutAdminSession(token)
}

export const adminAuthState = {
  accessToken: computed(() => accessToken.value),
  adminPhoneNumber: computed(() => adminPhoneNumber.value),
  isAuthenticated: computed(() => isAccessTokenValid()),
  rememberLoginPreference: computed(() => rememberLoginPreference.value),
}

export const setRememberLoginPreference = (value: boolean) => {
  hydrate()
  setRememberLogin(value)
}
