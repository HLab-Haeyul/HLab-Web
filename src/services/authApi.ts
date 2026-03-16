import {
  normalizeUserRole,
  type AuthenticatedUser,
} from '@/types/user'

type FetchOptions = {
  signal?: AbortSignal
}

type RecordUnknown = Record<string, unknown>

export type AuthSessionPayload = AuthenticatedUser & {
  accessToken: string
  tokenType: string
  expiresIn: number
  expiresAt: string
  rememberLogin: boolean
}

export type SmsSendResult =
  | {
      ok: true
      message: string
      expiresIn: number
      debugCode?: string
    }
  | {
      ok: false
      status: number
      message: string
    }

export type SmsVerifyResult =
  | {
      ok: true
      session: AuthSessionPayload
    }
  | {
      ok: false
      status: number
      message: string
    }

const DEFAULT_AUTH_API_PATH = '/api/auth'

const isRecord = (value: unknown): value is RecordUnknown =>
  typeof value === 'object' && value !== null

const asString = (value: unknown) => (typeof value === 'string' ? value : '')

const asNumber = (value: unknown) => (typeof value === 'number' ? value : 0)

const asBoolean = (value: unknown) => typeof value === 'boolean' && value

const extractPayload = (payload: unknown) =>
  isRecord(payload) && 'data' in payload ? payload.data : payload

const resolveAuthApiUrl = (pathSuffix = '') => {
  const absoluteUrl = (import.meta.env.VITE_AUTH_API_URL as string | undefined)?.trim()
  const baseUrl = (import.meta.env.VITE_AUTH_API_BASE_URL as string | undefined)?.trim()
  const apiPath =
    (import.meta.env.VITE_AUTH_API_PATH as string | undefined)?.trim() || DEFAULT_AUTH_API_PATH
  const origin = globalThis.location?.origin ?? 'http://localhost'

  const url = absoluteUrl ? new URL(absoluteUrl) : new URL(apiPath, baseUrl || origin)
  const suffix = pathSuffix.replace(/^\/+/, '')

  if (suffix) {
    url.pathname = `${url.pathname.replace(/\/$/, '')}/${suffix}`
  }

  return url.toString()
}

const normalizeSessionPayload = (payload: unknown): AuthSessionPayload | null => {
  const normalized = extractPayload(payload)

  if (!isRecord(normalized)) {
    return null
  }

  const accessToken = asString(normalized.accessToken ?? normalized.access_token)
  const tokenType =
    asString((normalized.tokenType ?? normalized.token_type) || 'bearer') || 'bearer'
  const expiresIn = asNumber(normalized.expiresIn ?? normalized.expires_in)
  const expiresAt = asString(normalized.expiresAt ?? normalized.expires_at)
  const phoneNumber = asString(normalized.phoneNumber ?? normalized.phone_number)
  const role = normalizeUserRole(normalized.role)
  const rememberLogin = asBoolean(normalized.rememberLogin ?? normalized.remember_login)

  if (!accessToken || !expiresAt || !phoneNumber || expiresIn <= 0) {
    return null
  }

  return {
    accessToken,
    tokenType,
    expiresIn,
    expiresAt,
    phoneNumber,
    role,
    rememberLogin,
  }
}

const normalizeMessage = (payload: unknown, fallbackMessage: string) => {
  const normalized = extractPayload(payload)

  if (!isRecord(normalized)) {
    return fallbackMessage
  }

  const message = asString(normalized.message)
  return message || fallbackMessage
}

export const sendSmsCode = async (
  phoneNumber: string,
  options: FetchOptions = {},
): Promise<SmsSendResult> => {
  const response = await fetch(resolveAuthApiUrl('/sms/send'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      phone_number: phoneNumber,
    }),
    signal: options.signal,
  })

  const payload = (await response.json().catch(() => null)) as unknown

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      message: normalizeMessage(payload, '인증번호 전송에 실패했습니다.'),
    }
  }

  const normalized = extractPayload(payload)

  if (!isRecord(normalized)) {
    return {
      ok: false,
      status: response.status,
      message: '인증번호 응답 형식이 올바르지 않습니다.',
    }
  }

  return {
    ok: true,
    message: asString(normalized.message) || '인증번호를 전송했습니다.',
    expiresIn: Math.max(0, asNumber(normalized.expiresIn ?? normalized.expires_in)),
    debugCode: asString(normalized.debugCode ?? normalized.debug_code) || undefined,
  }
}

export const verifySmsCode = async (
  phoneNumber: string,
  verificationCode: string,
  rememberLogin: boolean,
  options: FetchOptions = {},
): Promise<SmsVerifyResult> => {
  const response = await fetch(resolveAuthApiUrl('/sms/verify'), {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      phone_number: phoneNumber,
      verification_code: verificationCode,
      remember_login: rememberLogin,
    }),
    signal: options.signal,
  })

  const payload = (await response.json().catch(() => null)) as unknown

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      message: normalizeMessage(payload, '로그인에 실패했습니다.'),
    }
  }

  const session = normalizeSessionPayload(payload)

  if (!session) {
    return {
      ok: false,
      status: response.status,
      message: '로그인 응답 형식이 올바르지 않습니다.',
    }
  }

  return {
    ok: true,
    session,
  }
}

export const refreshAdminSession = async (
  options: FetchOptions = {},
): Promise<AuthSessionPayload | null> => {
  try {
    const response = await fetch(resolveAuthApiUrl('/refresh'), {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
      },
      signal: options.signal,
    })

    if (!response.ok) {
      return null
    }

    const payload = (await response.json().catch(() => null)) as unknown
    return normalizeSessionPayload(payload)
  } catch {
    return null
  }
}

export const fetchAdminMe = async (
  accessToken: string,
  options: FetchOptions = {},
): Promise<AuthenticatedUser | null> => {
  try {
    const response = await fetch(resolveAuthApiUrl('/me'), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      signal: options.signal,
    })

    if (!response.ok) {
      return null
    }

    const payload = extractPayload((await response.json().catch(() => null)) as unknown)

    if (!isRecord(payload)) {
      return null
    }

    const phoneNumber = asString(payload.phoneNumber ?? payload.phone_number)
    const role = normalizeUserRole(payload.role)

    if (!phoneNumber) {
      return null
    }

    return {
      phoneNumber,
      role,
    }
  } catch {
    return null
  }
}

export const logoutAdminSession = async (
  accessToken: string | null,
  options: FetchOptions = {},
) => {
  await fetch(resolveAuthApiUrl('/logout'), {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    signal: options.signal,
  }).catch(() => null)
}
