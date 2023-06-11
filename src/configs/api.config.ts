const axiosConfigs = {
  development: {
    baseURL: 'http://localhost:3001/api/',
    // baseURL: 'http://192.168.50.93:3001/api/',
    timeout: 10000
  },
  production: {
    baseURL: 'https://shop-rdms.akabui.online/',
    timeout: 10000
  }
}
const getAxiosConfig = () => {
  const nodeEnv: NodeJS.ProcessEnv['NODE_ENV'] = process.env.NODE_ENV;
  return axiosConfigs[nodeEnv];
}

export const axiosConfig = getAxiosConfig();