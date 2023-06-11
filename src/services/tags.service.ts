import {ApiBaseService} from "@/services/base.service";

export class TagsService extends ApiBaseService {
  authConfig: IAuthConfig;

  constructor() {
    super();
    if (typeof window !== "undefined") {
      this.authConfig = {
        headers: {
          Referer: window.location.hostname
        }
      }
    }
  }

  public async getOrders(queries: IQueries) {
    return (await this.httpClient.get<ILoadOrderResults>("/manage-tags", queries))?.data;
  }

  public async addTags(name: string) {
    return (await this.httpClient.post("/manage-tags", {name}))?.data;
  }

  public async createSiteOrder(payload: ICreateSiteOrder) {
    return (await this.httpClient.post("/orders/site", payload, this.authConfig))?.data;
  }

  public async updateTag(id:number,name:string) {
    return (await this.httpClient.patch(`/manage-tags/${id}`, {name}))?.data;
  }
}

export const tagService
  = new TagsService()