import { axiosPost, axiosGet } from '../index';
import type { AxiosInstanceResponseType } from '../index';

/**
 * 获取情形配置
 * @param id 
 * @returns 
 */
export function generate(id:string):Promise<AxiosInstanceResponseType>{
    return axiosPost(`/backBmgMatterCat/generate/${id}`,{})
}


/**
 * 获取事项大类下拉框
 * @returns 
 */
export function queryMatterCatSelect():Promise<AxiosInstanceResponseType>{
    return axiosGet('/backBmgMatterCat/queryMatterCatSelect')
}


/**
 * 根据事项id查询材料列表
 * @param matterId 
 * @returns 
 */
export function queryMatterMaterial(matterId:string):Promise<AxiosInstanceResponseType>{
    return axiosGet(`/backBmgSyncMaterial/queryMatterMaterial/${matterId}`)
}