import { axiosGet, axiosPost, axiosPut, axiosDelete, axiosDownload,axiosDownloadGet } from '@/axios';
import type { AxiosInstanceResponseType } from '@/axios';
import { download } from '@/utils/download';
import { ElMessage } from 'element-plus'

/**
 * 事项总览数量
 */
export function getDetailStatisticCountList():Promise<AxiosInstanceResponseType<TaskCount.GetDetailStatisticCountListResponse>>{
    return axiosGet('/taskCount/getDetailStatisticCountList')
}

interface AllMatterResponse extends ListPage{
    list:any[];
}

/**
 * 事项管理列表
 */
export function allMatter(params:TaskCount.GetAllMatterParams):Promise<AxiosInstanceResponseType<AllMatterResponse>>{
    return axiosPost('/taskCount/allMatter',params)
}

type TaskOnOffRes = 0|1
/**
 * 事项上架
 * @param id
 */
export function taskOn(id:string):Promise<AxiosInstanceResponseType<TaskOnOffRes>>{
    return axiosGet(`/taskCount/taskOn/${id}`)
}

/**
 * 事项下架
 * @param id
 */
export function taskOff(id:string):Promise<AxiosInstanceResponseType<TaskOnOffRes>>{
    return axiosGet(`/taskCount/taskOff/${id}`)
}

export interface GetAssignRuleListResponse extends ListPage{
    list:Record<string,string|number|undefined|null>[];
}

/**
 * 分流配置列表
 */
export function getAssignRuleList(params:TaskCount.GetAssignRuleListRequest):Promise<AxiosInstanceResponseType<GetAssignRuleListResponse>>{
    return axiosPost('/taskCount/getAssignRuleList',params)
}


export interface SelectAllParentCatalogueSelectResponse extends ListPage {
    list:{id:string;name:string;dmCode:string;value:string;content:string;}[];
}
/**
 * 字典管理列表
 */
export function selectAllParentCatalogueSelect(params:TaskCount.SelectAllParentCatalogueSelectRequest):Promise<AxiosInstanceResponseType<SelectAllParentCatalogueSelectResponse>>{
    return axiosPost('/taskCount/selectAllParentCatalogueSelect',params)
}

interface GetChangeListResponse extends ListPage {
    list:any[]
}

/**
 * 获取事项异动列表
 * @param p 
 * @returns 
 */
export function getChangeList(p:TaskCount.GetChangeListRequest):Promise<AxiosInstanceResponseType<GetChangeListResponse>>{
    return axiosPost('/taskCount/getChangeList',p)
}

/**
 * 获取关联关系绑定-同源字段
 * @returns 
 */
export function homologyList():Promise<AxiosInstanceResponseType<TaskCount.HomologyListResponse>>{
    return axiosGet('/taskCount/homologyList')
}

/**
 * 获取手动维护字段
 * @returns 
 */
export function matterList():Promise<AxiosInstanceResponseType<TaskCount.HomologyListResponse>>{
    return axiosGet('/taskCount/matterList')
}

interface ByMainIdResponse extends ListPage {
    list:any[]
}

/**
 * 获取事项异动详情
 * @param p 
 * @returns 
 */
export function byMainId(p:TaskCount.ByMainIdRequest):Promise<AxiosInstanceResponseType<ByMainIdResponse>>{
    return axiosPost('/taskCount/byMainId',p)
}

interface AllSetterMatterResponse extends ListPage {
    list:any[]
}

/**
 * 获取非公服事项列表
 * @param p 
 */
export function allSetterMatter(p:TaskCount.AllSetterMatterRequest):Promise<AxiosInstanceResponseType<AllSetterMatterResponse>>{
    return axiosPost('/taskCount/allSetterMatter',p)
}

/**
 * 获取非公服事项详情
 * @param id 
 */
export function setterInfo(id:string):Promise<AxiosInstanceResponseType<TaskCount.SetterInfoObject>>{
    return axiosGet(`/taskCount/setterInfo/${id}`)
}

/**
 * 更新非公服事项详情
 * @param vo 
 * @returns 
 */
export function updSetterInfo(vo:Partial<TaskCount.SetterInfoObject>):Promise<AxiosInstanceResponseType<1|0>>{
    return axiosPut('/taskCount/updSetterInfo',vo,'formData')
}

//事项详情-添加情形-查询重点案例
export function queryMatterAcceptance(params: TaskCount.GetMaterialBySituationObj): Promise<AxiosInstanceResponseType<SituationDialoginfoObj>> {
    return axiosPost('/taskCount/queryMatterAcceptance', params, 'formData')
}

/**
 * 获取实施主体下拉框
 * @returns 
 */
export function getOrganization():Promise<AxiosInstanceResponseType>{
    return axiosPost('/taskCount/getOrganization',{})
}

//事项详情-计算结果
export function calculateRuleSingleMatter(type: string, status: string, matterId: string, situationId: string):Promise<AxiosInstanceResponseType<any>>{
    return axiosGet(`/taskCount/calculateRuleSingleMatter/${type}/${status}/${matterId}/${situationId}/1`)
}

//事项详情-修改基本信息
export function updMatterBasic(params:TaskCount.UpdMatterBasicobj):Promise<AxiosInstanceResponseType<any>>{
    return axiosPut(`/taskCount/updMatterBasic`, params,'formData')
}

//事项详情-删除情形
export function deleteSituation(params: {matterId: string, situationId: string}):Promise<AxiosInstanceResponseType<any>>{
    return axiosDelete(`/taskCount/deleteSituation`, params)
}
//事项详情-情形-新增情形
export function saveSituation(params: TaskCount.SaveSituationobj):Promise<AxiosInstanceResponseType<any>>{
    return axiosPost(`/taskCount/saveSituation`, params)
}

//事项详情-情形-修改情形
export function updSituation(params: TaskCount.SaveSituationobj):Promise<AxiosInstanceResponseType<any>>{
    return axiosPut(`/taskCount/updSituation`, params)
}

//事项详情-情形-事项详情材料清单
export function selectMaterialByMatterId(id: string):Promise<AxiosInstanceResponseType<TaskCount.SelectMaterialByMatterObj[]>>{
    return axiosGet(`/taskCount/selectMaterialByMatterId/${id}`)
}

/**
 * 历史记录对比
 * @param p 
 * @returns 
 */
export function compareSyncMatter(p: TaskCount.CompareSyncMatterRequest):Promise<AxiosInstanceResponseType>{
    return axiosPost('/taskCount/compareSyncMatter',p)
}

/**
 * 事项异动导出
 * @param pageNum 
 * @param pageSize 
 */
export function exportChangeList(pageNum:number, pageSize:number){
    axiosDownload('/taskCount/exportChangeList',{pageNum, pageSize}).then(res=>{
        if(res.status===200){
            download(res);
        }else{
            ElMessage.error('导出失败')
        }
    })
}



//事项详情-版本对比
export function getChangeField(data: TaskCount.GetChangeField):Promise<AxiosInstanceResponseType<string[]>>{
    return axiosPost(`/taskCount/getChangeField`, data)
}

//导出知识问答模板
export function downloadMatterQaExcel(){
    axiosDownload('/taskCount/downloadMatterQaExcel').then(res=>{
        if(res.status===200){
            download(res);
        }else{
            ElMessage.error('导出失败')
        }
    })
}

//导出案例库模板
export function downloadMatterCasesQaExcel(){
    axiosDownload('taskCount/downloadMatterCasesQaExcel').then(res=>{
        if(res.status===200){
            download(res);
        }else{
            ElMessage.error('导出失败')
        }
    })
}

//事项详情-情形-自动获取办件量、是否有情形、材料是否超过3个
export function getSubInfoByMatterId(id: string):Promise<AxiosInstanceResponseType<TaskCount.GetSubInfoByMatterIdObj>>{
    return axiosGet(`/taskCount/getSubInfoByMatterId/${id}`)
}

/**
 * 获取未进驻事项
 * @param p 
 * @returns 
 */
export function allUnSetterMatter(p: TaskCount.GetAllMatterParams): Promise<AxiosInstanceResponseType<AllMatterResponse>>{
    return axiosPost('/taskCount/allUnSetterMatter',p)
}


/**
 * 事项异动提醒
 * @param id 异动列表id
 */
export function matterChangeRemind(id:string):Promise<AxiosInstanceResponseType>{
    return axiosGet(`/taskCount/matterChangeRemind/${id}`)
}

//根据id下载模板
export function downloadFileByDocId(id: string){
    axiosDownloadGet(`/taskCount/downloadFileByDocId/${id}`).then(res=>{
        if(res.status===200){
            download(res);
        }else{
            ElMessage.error('导出失败')
        }
    })
}
//根据事项id获取相关材料
export function getMaterialListByMatterId(id: string):Promise<AxiosInstanceResponseType<TaskCount.GetMaterialListByMatterIdObj[]>>{
    return axiosGet(`taskCount/getMaterialListByMatterId/${id}`)
}



/**
 * 分流配置获取事项名称
 */
export function getAllMatterByEnterHall():Promise<AxiosInstanceResponseType<{matterName:string}[]>>{
    return axiosGet('/taskCount/getAllMatterByEnterHall')
}