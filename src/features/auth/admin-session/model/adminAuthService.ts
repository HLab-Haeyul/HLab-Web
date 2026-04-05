import { computed, ref } from 'vue'
import {
  fetchAdminMe,
  logoutAdminSession,
  refreshAdminSession,
  sendSmsCode,
  type SmsSendResult,
  type SmsVerifyResult,
  verifySmsCode,
} from '@/shared/api/authApi'
import {
  hasAdminRole,
  normalizeUserRole,
  type AuthenticatedUser,
  type UserRole,
} from '@/entities/user'
import { getAdminBypassProfile, isAdminAuthBypassed } from '@/shared/config/adminAuth'

const ACCESS_TOKEN_STORAGE_KEY = 'hlab_admin_access_token'
const ACCESS_TOKEN_EXPIRES_AT_STORAGE_KEY = 'hlab_admin_access_token_expires_at'
const ACCESS_TOKEN_PHONE_STORAGE_KEY = 'hlab_admin_access_token_phone'
const ACCESS_TOKEN_ROLE_STORAGE_KEY = 'hlab_admin_access_token_role'
const REMEMBER_LOGIN_STORAGE_KEY = 'hlab_admin_remember_login'
const TOKEN_EXPIRY_SKEW_MS = 10_000

const accessToken = ref<string | null>(null)
const accessTokenExpiresAtMs = ref<number | null>(null)
const adminPhoneNumber = ref<string | null>(null)
const adminRole = ref<UserRole | null>(null)
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
  window.sessionStorage.removeItem(ACCESS_TOKEN_ROLE_STORAGE_KEY)
}

const persistSessionStorage = () => {
  if (!hasWindow()) {
    return
  }

  if (
    !accessToken.value ||
    !accessTokenExpiresAtMs.value ||
    !adminPhoneNumber.value ||
    !adminRole.value
  ) {
    clearSessionStorage()
    return
  }

  window.sessionStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken.value)
  window.sessionStorage.setItem(
    ACCESS_TOKEN_EXPIRES_AT_STORAGE_KEY,
    String(accessTokenExpiresAtMs.value),
  )
  window.sessionStorage.setItem(ACCESS_TOKEN_PHONE_STORAGE_KEY, adminPhoneNumber.value)
  window.sessionStorage.setItem(ACCESS_TOKEN_ROLE_STORAGE_KEY, adminRole.value)
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
  adminRole.value = null
  clearSessionStorage()
}

const setSessionFromPayload = (payload: {
  accessToken: string
  expiresAt: string
  phoneNumber: string
  role: UserRole
}) => {
  const expiresAtMs = Date.parse(payload.expiresAt)

  if (!Number.isFinite(expiresAtMs)) {
    clearSession()
    return false
  }

  accessToken.value = payload.accessToken
  accessTokenExpiresAtMs.value = expiresAtMs
  adminPhoneNumber.value = payload.phoneNumber
  adminRole.value = payload.role
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
  const storedRole = window.sessionStorage.getItem(ACCESS_TOKEN_ROLE_STORAGE_KEY)

  if (
    storedAccessToken &&
    Number.isFinite(storedExpiresAtMs) &&
    storedExpiresAtMs > 0 &&
    storedPhoneNumber &&
    storedRole
  ) {
    accessToken.value = storedAccessToken
    accessTokenExpiresAtMs.value = storedExpiresAtMs
    adminPhoneNumber.value = storedPhoneNumber
    adminRole.value = normalizeUserRole(storedRole)
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

const hasValidAdminSession = () =>
  isAdminAuthBypassed() || (isAccessTokenValid() && hasAdminRole(adminRole.value))

const getAdminRoleRequiredMessage = () => '관리자(admin) 권한이 필요합니다.'

const applyAdminProfile = (profile: AuthenticatedUser) => {
  adminPhoneNumber.value = profile.phoneNumber
  adminRole.value = profile.role
  persistSessionStorage()
}

export const getAdminAccessToken = () => {
  hydrate()

  if (isAdminAuthBypassed()) {
    return null
  }

  if (!hasValidAdminSession()) {
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

  if (!hasAdminRole(result.session.role)) {
    clearSession()

    return {
      ok: false,
      status: 403,
      message: getAdminRoleRequiredMessage(),
    }
  }

  setRememberLogin(rememberLogin)
  const applied = setSessionFromPayload({
    accessToken: result.session.accessToken,
    expiresAt: result.session.expiresAt,
    phoneNumber: result.session.phoneNumber,
    role: result.session.role,
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

  if (isAdminAuthBypassed()) {
    return true
  }

  const token = getAdminAccessToken()

  if (token) {
    const profile = await fetchAdminMe(token)

    if (profile && hasAdminRole(profile.role)) {
      applyAdminProfile(profile)
      return true
    }
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
      role: refreshed.role,
    })

    if (!applied) {
      clearSession()
      return false
    }

    const refreshedToken = getAdminAccessToken()

    if (!refreshedToken) {
      clearSession()
      return false
    }

    const profile = await fetchAdminMe(refreshedToken)

    if (!profile || !hasAdminRole(profile.role)) {
      clearSession()
      return false
    }

    applyAdminProfile(profile)
    return true
  })()

  try {
    return await refreshPromise
  } finally {
    refreshPromise = null
  }
}

export const loadAdminProfile = async () => {
  if (isAdminAuthBypassed()) {
    return getAdminBypassProfile()
  }

  const token = getAdminAccessToken()

  if (!token) {
    return null
  }

  const profile = await fetchAdminMe(token)

  if (!profile) {
    return null
  }

  if (!hasAdminRole(profile.role)) {
    clearSession()
    return null
  }

  applyAdminProfile(profile)
  return profile
}

export const logoutAdmin = async () => {
  if (isAdminAuthBypassed()) {
    clearSession()
    return
  }

  const token = accessToken.value
  clearSession()
  await logoutAdminSession(token)
}

export const adminAuthState = {
  accessToken: computed(() => accessToken.value),
  adminPhoneNumber: computed(() =>
    isAdminAuthBypassed() ? getAdminBypassProfile().phoneNumber : adminPhoneNumber.value,
  ),
  adminRole: computed(() => (isAdminAuthBypassed() ? getAdminBypassProfile().role : adminRole.value)),
  isAuthenticated: computed(() => hasValidAdminSession()),
  rememberLoginPreference: computed(() => rememberLoginPreference.value),
}

export const setRememberLoginPreference = (value: boolean) => {
  hydrate()
  setRememberLogin(value)
}
