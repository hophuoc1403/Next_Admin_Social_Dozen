import {ApiBaseService} from "@/services/base.service";

export class ReportedPostService extends ApiBaseService {
  public async getPosts(queries?: IQueries) {
    return (await this.httpClient.get("/posts/reported-post/get", queries))?.data;
  }

  async deletePost(id:number){
    return (await this.httpClient.delete("/posts/reported-post/"+id))?.data;
  }
}

export const siteService = new ReportedPostService();