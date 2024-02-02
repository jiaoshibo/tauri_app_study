import Axios from 'axios';
import type { AxiosInstanceResponseType } from './index'
import {ElMessage} from "element-plus";

const {get, interceptors: {response}} = Axios.create({
    baseURL: import.meta.env.VITE_AUTH_PROXY,
    timeout: 60 * 1000
})

response.use(
    response => {
        if (response.data.data && response.data.data.code) {
            ElMessage.error('服务器错误')
            return Promise.reject(response.data.data.msg)
        } else {
            return response
        }
    },
    error => {
        ElMessage.error('服务器错误')
        return Promise.reject(error)
    }
)


interface UserRoleVo extends Record<any,any>{
    id:string;
    name:string;
    extraStr:string;
    commonExtraStr:string;
}

export interface UserInfo {
    guid:string;
    name:string;
    ruleList:UserRoleVo[];
    userId:string;
    userName:string;
    userPermission:string[];
}



/**
 * 获取4A登录信息
 */
export const getUserInfo = async ():Promise<AxiosInstanceResponseType<UserInfo>> =>{
    return await get('/auth/saveSessionByTicket?appId=30022')
}