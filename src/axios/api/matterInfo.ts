import {axiosGet, axiosPost, axiosPut, axiosDelete} from '../index';
import type { AxiosInstanceResponseType } from '@/axios';

//事项详情-基本信息
export function taskBasicInfo(id: string):Promise<AxiosInstanceResponseType<MatterInfo[]>>{
    return axiosGet(`/taskCount/taskBasicInfo/${id}`)
}
//事项详情-同源信息
export function homology(id: string):Promise<AxiosInstanceResponseType<HomologyData[]>>{
    return axiosGet(`/taskCount/homology/${id}`)
}
/**
 * 获取各个下拉框的值
 * @param type 字典CODE
 */
export function selectCheckBoxSelect(type: string):Promise<AxiosInstanceResponseType<DictionaryObj[]>>{
    return axiosGet(`/taskCount/selectCheckBoxSelect/${type}`)
}

//新建知识库
export function backBmgCommonQa(params:knowledgePointsParams):Promise<AxiosInstanceResponseType<knowledgePointsSuccess>>{
    return axiosPost('/backBmgCommonQa',params)
}

//编辑知识库
export function editKnodewList(params:knowledgePointsParams):Promise<AxiosInstanceResponseType<knowledgePointsSuccess>>{
    return axiosPut('/backBmgCommonQa',params)
}

//删除知识库
export function deleteKnodewList(params: {id: string}):Promise<AxiosInstanceResponseType<any>>{
    return axiosDelete('/backBmgCommonQa',params)
}

//新建案例库
export function BmgSpecialCasesQa(params:caseParams):Promise<AxiosInstanceResponseType<any>>{
    return axiosPost('/BmgSpecialCasesQa',params, 'formData')
}

//编辑案例库
export function editBmgSpecialCasesQa(params:caseParams):Promise<AxiosInstanceResponseType<any>>{
    return axiosPut('/BmgSpecialCasesQa',params,'formData')
}

//删除案例库
export function deleteBmgSpecialCasesQa(params: {id: string}):Promise<AxiosInstanceResponseType<any>>{
    return axiosDelete('/BmgSpecialCasesQa',params)
}

//事项详情-添加情形-查询申请材料
export function getMaterialBySituation(params:GetMaterialBySituationObj):Promise<AxiosInstanceResponseType<any>>{
    return axiosPost('/taskCount/getMaterialBySituation',params, 'formData')
}


