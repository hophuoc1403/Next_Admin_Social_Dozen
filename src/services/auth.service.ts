import {ApiBaseService} from "./base.service";
export class AuthService extends ApiBaseService {


  public async register(payload: IRegisterPayload) {
    return (await this.httpClient.post("/auth/register", payload))?.data;
  }

  public async login(payload: ILoginPayload) {
    return (await this.httpClient.post("/auth/sign-in", payload))?.data;
  }

  public async loginWithSSO(payload: ILoginSSOPayload) {
    return (await this.httpClient.post("/auth/sso", payload))?.data;
  }

  public async resendVerifyEmail(payload: IResendVerifyEmailPayload) {
    return (await this.httpClient.post("/auth/verify-account/new", payload))?.data;
  }

  public async forgetPassword(payload: IForgetPasswordPayload) {
    return (await this.httpClient.post("/auth/forget_password", payload))?.data;
  }


  public async logout(payload: ILogoutPayload) {
    return (await this.httpClient.post("/auth/logout", payload))?.data;
  }
}

export const authService = new AuthService();
