import axios, { AxiosError, type AxiosInstance, type AxiosResponse, type AxiosRequestConfig,} from 'axios';

import { MessagePlugin } from 'tdesign-vue-next';
import type {ErrorResponse} from '@/api/types'
import { useAppStore } from '@/store';

const BASE_URL: string = import.meta.env.VITE_API_BASE_URL;

const instance: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout:60000,

});
const tokenPrefix = "Bearer ";


instance.interceptors.request.use((request: AxiosRequestConfig ) => {
  const appStore = useAppStore();
  
  
  if (appStore.token && request.headers) {
    request.headers = {Authorization: tokenPrefix + appStore.token}
  }
  return request;
});


instance.interceptors.response.use(
    (response: AxiosResponse) => {
        return response.data;                 //        'Successfully login'
    },
    async (error: AxiosError<ErrorResponse>) => {
        const responseData:  ErrorResponse | undefined = error.response?.data;
        responseData && await MessagePlugin.error(error.message);   //        'Request failed with status code 400'
        if (error.response?.status === 401 || error.response?.status === 403 ){  //        'Request failed with status code 401 || 403'
            const appStore = useAppStore();
            await appStore.logout();

        }
        return Promise.reject(error);         
    }
);


export default instance;