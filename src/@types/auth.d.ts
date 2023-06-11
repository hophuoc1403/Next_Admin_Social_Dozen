interface IAuthToken {
  access_token?: string;
  refresh_token?: string;
  access_token_expires_in?: number;
  access_token_expires_at?: number;
}
interface IAuthConfig {
  headers: {
    Referer: string;
  }
}
interface IRegisterPayload {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  recaptcha: string | null;
}

interface ILoginPayload {
  loginField?: string;
  password?: string
}

interface ILoginSSOPayload {
  grantType: string;
  redirectUri: string;
  authorizationCode: string;
  service: string;
}

interface IResendVerifyEmailPayload {
  email: string;
  recaptcha: string;
}

interface IForgetPasswordPayload {
  email: string;
  recaptcha: string;
}

interface IRefreshPayload {
  refresh_token: string;
}

interface ILogoutPayload {
  refreshToken: string;
}

interface IAuth{
  data: IAccount
}