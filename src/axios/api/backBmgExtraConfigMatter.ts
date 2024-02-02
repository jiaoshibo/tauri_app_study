import * as axios from '../index';
import type { AxiosInstanceResponseType } from '../index';


/**
 * 新增字段目录
 * @param p 
 * @returns 
 */
export function postBackBmgExtraConfigMatter(p:{name:string}):Promise<AxiosInstanceResponseType>{
    return axios.axiosPost('/backBmgExtraConfigMatter',p,'formData')
}


// backBmgExtraConfigMatter/updName
/**
 * 修改字段目录
 * @param p 
 * @returns 
 */
export function updName(p:{
    id?:string,name:string
}){
    return axios.axiosPut('/backBmgExtraConfigMatter/updName',p,'formData')
}

/**
 * 删除字段目录
 * @param id 
 * @returns 
 */
export function delBackBmgExtraConfigMatter(id:string):Promise<AxiosInstanceResponseType>{
    return axios.axiosDelete('/backBmgExtraConfigMatter',{id})
}


/**
 * 修改字典选项
 * @param p 
 * @returns 
 */
export function putBackBmgExtraConfigMatter(p:{id:string;content:string}):Promise<AxiosInstanceResponseType> {
    return axios.axiosPut('/backBmgExtraConfigMatter',p,'formData')
}

/**
 * 新增字典选项
 * @param p 
 * @returns 
 */
export function addOption(p:{id:string;content:string}):Promise<AxiosInstanceResponseType>{
    return axios.axiosPost('/backBmgExtraConfigMatter/addOption',p,'formData')
}



// backBmgExtraConfigMatter/getOptionByName



/**
 * 获取选项目录
 */
export function getOptionByName(name:string):Promise<AxiosInstanceResponseType<any[]>>{
    return axios.axiosPost('/backBmgExtraConfigMatter/getOptionByName',{name},)
}