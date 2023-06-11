type AxiosRequestConfig = import('axios').AxiosRequestConfig;
interface IHttpRequestConfig extends AxiosRequestConfig {
  isNotRequiredAuthentication?: boolean;
}
