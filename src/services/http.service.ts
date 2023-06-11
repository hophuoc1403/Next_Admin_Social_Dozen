import type {AxiosError, AxiosInstance, AxiosResponse} from "axios";
import axios from "axios";
import LocalStorageService from "@/services/storage.service";
import {generateQueryString} from "@/utils";
import {AUTH_KEYS} from "@/configs/keys.config";
import {HTTP_CODES} from "@/configs/http.config";
import {axiosConfig} from "@/configs/api.config";
import jwt_decode from "jwt-decode";

export default class Http {
  private instance: AxiosInstance;

  constructor(config?: IHttpRequestConfig) {
    const axiosConfigs = config || {};
    const instance = axios.create({...axiosConfigs});
    Object.assign(instance, this.setupInterceptorsTo(instance));
    this.instance = instance;
  }

  private async onRefreshToken() {
    const {refresh_token}: IAuthToken = LocalStorageService.get(AUTH_KEYS.TOKEN, "");
    if (refresh_token) {
      return (await axios.post(`${axiosConfig?.baseURL}auth/refresh`, {refresh_token}, {
        headers: {
          Referer: typeof window !== "undefined" ? window.location.hostname : ""
        }
      }))?.data;
    }
  }

  private onRequest = async (
    config: IHttpRequestConfig
  ) => {
    const {TOKEN, ACCESS_TOKEN, REFRESH_TOKEN, ACCESS_TOKEN_EXPIRES_IN, ACCESS_TOKEN_EXPIRES_AT} = AUTH_KEYS;
    if (config.headers) {
      if (!config.isNotRequiredAuthentication) {
        const {access_token, access_token_expires_at}: IAuthToken = LocalStorageService.get(AUTH_KEYS.TOKEN, "");
        const isExpiredToken = access_token_expires_at * 1000 < (new Date()).getTime();
        if (isExpiredToken) {
          // const token = await this.onRefreshToken();
          // const {access_token, refresh_token, access_token_expires_in} = token;
          // const {exp}: any = jwt_decode(access_token);
          // LocalStorageService.set(TOKEN, {
          //   [ACCESS_TOKEN]: access_token,
          //   [REFRESH_TOKEN]: refresh_token,
          //   [ACCESS_TOKEN_EXPIRES_IN]: access_token_expires_in,
          //   [ACCESS_TOKEN_EXPIRES_AT]: exp,
          // })
          // Object.assign(config.headers, {
          //   Authorization: `Bearer ${access_token}`,
          // });
          // window.location.replace("/auth/sign-in")
        } else {
          Object.assign(config.headers, {
            Authorization: `Bearer ${access_token}`,
          });
        }
      }
    }
    return config;
  };

  private onRequestError = (error: AxiosError): Promise<AxiosError> => {
    console.error(`[request error] [${JSON.stringify(error)}]`);
    return Promise.reject(error);
  };

  private onResponse = (response: AxiosResponse): AxiosResponse => {
    return response;
  };

  private onResponseError = (error: AxiosError): Promise<AxiosError> => {
    const statusCode = error?.response?.status;
    switch (statusCode) {
      case HTTP_CODES.Unauthorized: {
        if (typeof window !== "undefined" && !window.location.pathname.startsWith("/auth")) window.location.replace("/auth/sign-in")
        break;
      }
      // case HTTP_CODES.InternalServerError: {
      //   window.location.replace("/status/500")
      //   break;
      // }
    }
    return Promise.reject(error);
  };

  private setupInterceptorsTo(axiosInstance: AxiosInstance): AxiosInstance {
    axiosInstance.interceptors.request.use(this.onRequest, this.onRequestError);
    axiosInstance.interceptors.response.use(
      this.onResponse,
      this.onResponseError
    );
    return axiosInstance;
  }

  public async get<T>(url: string, queries: IQueries = {}, config?: IHttpRequestConfig) {
    return await this.instance.get<T>(`${url}${generateQueryString(queries)}`, config);
  }

  public async post<T>(url: string, data?: any, config?: IHttpRequestConfig) {
    return await this.instance.post<T>(url, data, config);
  }

  public async patch<T>(url: string, data: any, config?: IHttpRequestConfig) {
    return await this.instance.patch<T>(url, data, config);
  }

  public async delete(url: string, config?: IHttpRequestConfig) {
    return await this.instance.delete(url, config);
  }


  public setHttpConfigs(config?: Partial<IHttpRequestConfig>) {
    if (config?.baseURL) {
      this.instance.defaults.baseURL = config.baseURL;
    }
  }

}
