import {axiosGet} from '../index';
import type { AxiosInstanceResponseType } from '@/axios';

//获取相关事项
export function getAllMatterSelector(pageNum: number, pageSize: number):Promise<AxiosInstanceResponseType<CorrelationData>>{
    return axiosGet(`/matterSituation/getAllMatterSelector/${pageNum}/${pageSize}`)
}

//根据相关事项获取办理地址
export function getMatterAddr(id: string):Promise<AxiosInstanceResponseType<CorrelationList>>{
    return axiosGet(`/matterSituation/getMatterAddr/${id}`)
}


