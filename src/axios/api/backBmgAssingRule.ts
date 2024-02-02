import * as axios from '../index';
import type { AxiosInstanceResponseType } from '../index'

/**
 * 分流配置-获取字段名
 * @returns 
 */
export function queryAllDict(): Promise<AxiosInstanceResponseType> {
    return axios.axiosGet('backBmgAssignRule/queryAllDict')
}

/**
 * 新增/修改/删除/查询分流配置
 * @param param 参数 类型为 string 时为查询或者删除，类型为对象时为新增和修改
 * @param method 请求类型
 */
export function backBmgAssignRule(param: Record<string, any>, method: 'axiosPost' | 'axiosPut',): Promise<AxiosInstanceResponseType<boolean>>
export function backBmgAssignRule(param: string, apiType: 'axiosGet' | 'axiosDelete'): Promise<AxiosInstanceResponseType>
export function backBmgAssignRule(param: string | Record<string, any>, apiType: 'axiosPost' | 'axiosPut' | 'axiosGet' | 'axiosDelete'): Promise<AxiosInstanceResponseType> {
    if (typeof param === 'object' && (apiType === 'axiosPost' || apiType === 'axiosPut')) {
        // 新增或者修改分流配置
        return axios[apiType]('/backBmgAssignRule', param)
    } else if (typeof param === 'string' && (apiType === 'axiosDelete' || apiType === 'axiosGet')) {
        // 查询详情或者删除
        return axios[apiType](`/backBmgAssignRule/${param}`)
    } else {
        throw new Error('apiType 值错误, 期望的值：axiosPost | axiosPut | axiosDelete| axiosGet')
    }
}