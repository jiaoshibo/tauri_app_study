import Axios from 'axios';
import Qs from 'qs';
import type { AxiosRequestConfig, AxiosResponse, AxiosHeaderValue } from 'axios';
import axiosTauriApiAdapter from 'axios-tauri-api-adapter';
import { ElMessage } from 'element-plus';
import {invoke} from '@tauri-apps/api'
import {RustCommand} from "@/command/rustCommand";


const axios = Axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 60 * 1000,
    adapter: import.meta.env.MODE === 'development' ? undefined : axiosTauriApiAdapter,
})


axios.interceptors.response.use(
    async response => {
        try {
            let log_axios_message:string = `url: ${response.config.baseURL}${response.config.url} \t request: ${JSON.stringify(response.config.data)} \t response: ${JSON.stringify(response.data)}`;
            await invoke(RustCommand.log_axios_message,{message:log_axios_message});
            if (response.data.data && response.data.data.code) {
                ElMessage.error('服务器错误')
                return Promise.reject(response.data.data.msg)
            } else {
                return response
            }
        }catch (e) {
            return Promise.reject(e);
        }

    },
    error => {
        ElMessage.error('服务器错误')
        return Promise.reject(error)
    }
)


interface ResponseDataType<T = any> {
    code: number;
    data: T;
    message: string;
}

/** 定义 axios 接口响应 data 类型 */
export type AxiosInstanceResponseType<T = any> = AxiosResponse<ResponseDataType<T>>


/**
 * POST 请求
 * @param url 接口地址
 * @param params 请求参数
 * @param contentType 请求体编码格式，formData 使用 application/x-www-form-urlencoded，json 使用 application/json，默认为 json
 */
export const axiosPost = <T extends Record<string, any> = Record<string, any>>(url: string, params: T, contentType: 'formData' | 'json' = 'json') => {
    return contentType === 'formData' ? axios.post(url, Qs.stringify(params)) : axios.post(url, params)
}


/**
 * GET 请求
 * @param url 接口地址
 * @param params 请求参数
 */
export const axiosGet = (url: string, params?: Record<string, string | undefined>) => {
    const config: AxiosRequestConfig = {
        url: url,
        method: 'GET'
    }
    if (params) config.params = params;
    return axios(config)
}


/**
 * 文件上传
 * @param url 接口地址
 * @param formData 请求参数
 */
export const axiosUpload = <T extends Record<string, any> = Record<string, any>>(url: string, formData: T) => {
    return axios.postForm(url, formData)
}


export const axiosDelete = <T extends Record<string, any> = Record<string, any>>(url: string, params?: T) => {
    const config: AxiosRequestConfig = {
        url,
        method: 'delete',
        params
    }
    return axios(config)
}


export const axiosPut = <T extends Record<string, any> = Record<string, any>>(url: string, params: T, contentType: 'formData' | 'json' = 'json') => {
    return contentType === 'formData' ? axios.put(url, Qs.stringify(params)) : axios.put(url, params)
}


export const axiosDownload = <T extends Record<string, any> = Record<string, any>>(url:string, params?:T)=>{
    return axios.post(url,params,{responseType:'blob'})
}


export const axiosDownloadGet = (url: string, params?: Record<string, string | undefined>) => {
    const config: AxiosRequestConfig = {
        url: url,
        method: 'GET',
        responseType:'blob'
    }
    if (params) config.params = params;
    return axios(config)
}