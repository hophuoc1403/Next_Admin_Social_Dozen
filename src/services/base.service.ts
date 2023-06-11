import Http from "./http.service";
import {axiosConfig} from "@/configs/api.config";

export class ApiBaseService {
  protected httpClient: Http;

  constructor() {
    this.httpClient = new Http(axiosConfig);
  }
}

export const apiBaseService = new ApiBaseService();
