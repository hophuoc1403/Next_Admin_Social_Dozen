import {ApiBaseService} from "@/services/base.service";

export class AccountService extends ApiBaseService {
  public async getAccountInfo() {
    return (await this.httpClient.get("/users/self-info"))?.data;
  }

  public async getPublicAccount() {
    return (await this.httpClient.get("/accounts/public"))?.data;
  }

  public async getPublicAccountByID(payload: IPublicAccountByIDPayload) {
    return (await this.httpClient.get(`/accounts/public/${payload.id}`))?.data;
  }

  public async getAccounts(queries?: IQueries) {
    return (await this.httpClient.get<ILoadAccountResults>("/manage-accounts",queries))?.data;
  }

  public async changePassword(payload: IChangePasswordPayload) {
    return (await this.httpClient.post("/accounts/change_password", payload))?.data;
  }

  public async verifyAccount(payload: IVerifyAccountPayload) {
    return (await this.httpClient.post("/accounts/verify_account", payload))?.data;
  }

  public async uploadAvatar(payload: FormData) {
    return (await this.httpClient.post("/accounts/upload_avatar", payload))?.data;
  }

  public async activeAccount(payload: IActiveAccountPayload) {
    return (await this.httpClient.patch(`/accounts/${payload.id}`,{isActivated:true}))?.data;
  }

  public async updateProfile(payload: IUpdateProfilePayload) {
    return (await this.httpClient.patch("/accounts/me", payload))?.data;
  }

  public async adminUpdateProfile(id: string, payload: IUpdateProfilePayload) {
    return (await this.httpClient.patch<IAccount>(`/accounts/${id}`, payload))?.data;
  }

  public async changePasswordWithToken(payload: IChangePassWordPayload) {
    return (await this.httpClient.post("/accounts/change_password_with_token", payload))?.data;
  }

  public  async  deleteAccount(id:number){
    await this.httpClient.delete("/manage-accounts/delete/"+id)
  }
}

export const accountService = new AccountService();