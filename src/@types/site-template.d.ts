interface IEnvVar {
  key: string,
  value: string,
  _id: string,
  createdAt: string,
  updatedAt: string
}

interface ISiteTemplate {
  _id: string,
  owner: string,
  name: string,
  dockerImage: string,
  isEnabled: boolean,
  envVar: IEnvVar[]
  isDefault: boolean,
  createdAt: string,
  updatedAt: string,
}

interface ICreateSiteTemplate {
  name: string,
  dockerImage: string,
  envVar: IEnvVar[],
}

interface IUpdateSiteTemplate {
  name: string,
  dockerImage: string,
  envVar: IEnvVar[],
  isEnabled: boolean,
}

interface LoadSiteTemplates {
  data: ISiteTemplate[],
  paginationOptions: IApiPagination
}


