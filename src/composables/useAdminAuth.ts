import {
  adminAuthState,
  ensureAdminAuthenticated,
  loadAdminProfile,
  loginAdminWithSms,
  logoutAdmin,
  requestAdminSmsCode,
  setRememberLoginPreference,
} from '@/services/adminAuthService'

export const useAdminAuth = () => ({
  accessToken: adminAuthState.accessToken,
  adminPhoneNumber: adminAuthState.adminPhoneNumber,
  adminRole: adminAuthState.adminRole,
  isAuthenticated: adminAuthState.isAuthenticated,
  rememberLoginPreference: adminAuthState.rememberLoginPreference,
  requestSmsCode: requestAdminSmsCode,
  loginWithSms: loginAdminWithSms,
  ensureAuthenticated: ensureAdminAuthenticated,
  loadProfile: loadAdminProfile,
  logout: logoutAdmin,
  setRememberLoginPreference,
})
