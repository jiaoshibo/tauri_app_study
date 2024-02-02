import * as axios from '../index';
import type { AxiosInstanceResponseType } from '../index';

//受理要点新增
export function insertAcceptanceKey(params: AcceptanceKeyList):Promise<AxiosInstanceResponseType<any>>{
    return axios.axiosPost(`bmgSituationMaterialAcceptanceKey/insert`, params)
}

//受理要点编辑
export function updateAcceptanceKey(params: AcceptanceKeyList):Promise<AxiosInstanceResponseType<any>>{
    return axios.axiosPut(`bmgSituationMaterialAcceptanceKey/update`, params)
}

//受理要点删除
export function deleteAcceptanceKey(id: string):Promise<AxiosInstanceResponseType<any>>{
    return axios.axiosDelete(`bmgSituationMaterialAcceptanceKey/delete/${id}`)
}