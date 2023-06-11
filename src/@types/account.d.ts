type Role = ROLES.ADMIN | ROLES.SYSADMIN | ROLES.USER;

interface IAccount {
  id: number;
  firstName?: string;
  lastName?: string;
  friends?: IAccount[];
  location?: string;
  occupation?: string;
  viewedProfile?: number;
  impressions?: string;
  picturePath?: string;
  updatedAt?: string;
  createdAt?:string
  status?: string
  email:string
  role?:string
}

interface IPublicAccountByIDPayload {
  id: string;
}

interface IChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface IVerifyAccountPayload {
  verifyToken: string;
}

interface IUploadAvatarPayload {
  avatar: Form;
}

interface IActiveAccountPayload {
  id: string;
}

interface IUpdateProfilePayload {
  displayName?: string;
  gender?: string;
}

interface IChangePassWordPayload {
  newPassword: string;
  confirmPassword: string;
  verifyToken: string;
}

interface ILoadAccountResults {
  items: IAccount[],
  meta: IApiPagination
}