import {axiosGet, axiosPost, axiosDelete, axiosPut} from '@/axios';
import type { AxiosInstanceResponseType } from '@/axios';

export interface GetBindingRequest {
    syncDmName?:string;
    matterDmName?:string;
    pageNum:number;
    pageSize:number;
}

interface GetBindingResponse extends ListPage {
    list:any[]
}

export function getBinding(params:GetBindingRequest):Promise<AxiosInstanceResponseType<GetBindingResponse>>{
    return axiosPost('/bmgBinDing/getBinding',params,'formData')
}



interface BmgBinDingRequest {
    syncDmId:string;
    matterDmId:string[];
    syncDmName:string;
    matterDmName:string[];
    id:string;
}


/**
 * 保存绑定关系
 */
export function bmgBinDing(p:Partial<BmgBinDingRequest>,reqType:'post'):Promise<AxiosInstanceResponseType>
export function bmgBinDing(p:Partial<BmgBinDingRequest>,reqType:'put'):Promise<AxiosInstanceResponseType>
export function bmgBinDing(p:string,reqType:'delete'):Promise<AxiosInstanceResponseType>
export function bmgBinDing(p:Partial<BmgBinDingRequest>|string,reqType:'post'|'delete'|'put'):Promise<AxiosInstanceResponseType>{
    let req:Record<string,string|undefined>
    if((reqType==='post' || reqType==='put') && typeof p ==='object'){
        req = {
            syncDmId:p.syncDmId,
            matterDmId:p.matterDmId?.join(','),
            syncDmName:p.syncDmName,
            matterDmName:p.matterDmName?.join(',')
        }
        if(reqType==='post'){
            return axiosPost('/bmgBinDing',req,'formData')
        }else{
            req.id = p.id;
            return axiosPut('/bmgBinDing',req,'formData')
        }
    }
    else{
        return axiosDelete('/bmgBinDing',{id:p})
    }
}