import {ApiBaseService} from "@/services/base.service";

export class SiteTemplateService extends ApiBaseService {
  async getTemplates(queries?: IQueries) {
    return (await this.httpClient.get<LoadSiteTemplates>("/site-templates", queries))?.data
  }

  public async createSiteTemplate(payload: ICreateSiteTemplate) {
    return (await this.httpClient.post("/site-templates", payload))?.data;
  }

  public async updateSiteTemplate(payload: IUpdateSiteTemplate, id: string) {
    return (await this.httpClient.patch(`/site-templates/${id}`, payload))?.data;
  }

  public async deleteSiteTemplate(id: string) {
    return (await this.httpClient.delete(`/site-templates/${id}`))?.data;
  }
}

export const siteTemplateService = new SiteTemplateService()