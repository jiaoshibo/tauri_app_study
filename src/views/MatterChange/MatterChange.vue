<!-- 事项异动 -->
<script setup lang="ts">
import {reactive, ref, onBeforeMount} from 'vue';
import { useRouter } from 'vue-router';
import { PageConfig, useTableIndex } from '@/hooks/usePageConfig'
import ListPageLayout from '@/components/ListPageLayout.vue';
import * as __axios_api_taskCount from '@/axios/api/taskCount';
import { ElMessage } from 'element-plus';
import { Search, RefreshRight, Download } from '@element-plus/icons-vue';
import asyncPool from '@/utils/asyncPool';
import { selectCheckBoxSelect } from '@/axios/api/matterInfo';
import {isPermissionGranted, requestPermission,sendNotification } from "@tauri-apps/api/notification";


const router = useRouter();

let notify = localStorage.getItem('notify');

onBeforeMount(()=>{
    getTableData();
    asyncPool(3, [__axios_api_taskCount.getOrganization(), selectCheckBoxSelect('YWLX')]).then(res => {
        if (res[0].data.code === 2001) {
            deptNameOptions.value = res[0].data.data
        }
        if (res[1].data.code === 2001) {
            matterTypeSelectOptions.value = res[1].data.data
        }
    })
    checkoutNotification();
})

let isPermission:boolean;

async function checkoutNotification(){
    isPermission = await isPermissionGranted();
    if (!isPermission){
        const permission = await requestPermission();
        isPermission = permission==='granted';
    }
}

function sendNotificationHandler(){
    if(isPermission){
        sendNotification({
            title:"事项异动提醒",
            body:"发送提醒"
        })
    }
}

const pageConfig = reactive(new PageConfig());


// 表格 👇
const tableData = ref<any[]>([]);

const matterTypeSelectOptions = ref<DictionaryObj[]>([])
const deptNameOptions = ref<any[]>([]);

let searchForm = reactive<Partial<TaskCount.GetChangeListRequest>>({isFinish:'0'})

const tableLoading = ref(false);
const tableKey = ref(1);

function getTableData(){
    tableKey.value++;
    tableLoading.value = true;
    let params: TaskCount.GetChangeListRequest = {
        pageNum:pageConfig.getCurrentPage,
        pageSize:pageConfig.getPageSize,
        ...searchForm
    }

    __axios_api_taskCount.getChangeList(params).then(res=>{
        if(res.data.code===2001){
            tableData.value = res.data.data.list;
            pageConfig.setTotalCount = res.data.data.total;
        }else{
            ElMessage.error(res.data.message)
        }
    }).catch(e=>{
        ElMessage.error(e)
    }).finally(()=>{
        tableLoading.value = false;
    })
}


function resetSearchForm(){
    searchForm = reactive({});
    getTableData();
}

function nav(path:string) {
    router.push({path})
}

function toMatterDetail(row:Record<string,any>) {
    router.push({
        path: "/matterDetails",
        query:{
            id: row.handleId,
            matterId: row.rowguid,
            matterName: row.matterName,
            situationId: '',
            situationName: '',
            type:'3' // 目的：修改详情的标题
        }
    })
}

/**
 * 提醒
 * @param id 
 */
function alertHandler(id:string){
    if(notify && notify==='通知'){
        sendNotificationHandler();
    }else{
        ElMessage.success('提醒成功');
        /* __axios_api_taskCount.matterChangeRemind(id).then(res => {
            if (res.data.code === 2001) {
                ElMessage.success('提醒成功');
                getTableData()
            } else {
                ElMessage.error('提醒失败');
            }
        }) */
    }
    
}


// 表格 👆
</script>

<template>
    <ListPageLayout :breadcrumb-item="['事项管理','事项异动']">
        <template #searchCard>
            <div class="search_card">
                <div style="width:90%">
                    <span class="span_pr16">
                        <el-select v-model="searchForm.workTypeName" placeholder="选择业务类型名称" clearable>
                            <el-option v-for="item in matterTypeSelectOptions" :key="item.value" :label="item.content" :value="item.value"></el-option>
                        </el-select>
                    </span>
                    <span class="span_pr16">
                        <el-input placeholder="请输入事项情形/名称/子项" v-model="searchForm.matterName" />
                    </span>
                    <span class="span_pr16">
                        <el-select placeholder="变更类型" v-model="searchForm.status">
                            <el-option value="1" label="新增"></el-option>
                            <el-option value="2" label="变更"></el-option>
                            <el-option value="3" label="取消"></el-option>
                        </el-select>
                    </span>
                    <span class="span_pr16">
                        <el-select v-model="searchForm.deptName" placeholder="实施主体">
                            <el-option v-for="item in deptNameOptions" :key="item.id" :label="item.orgName" :value="item.orgShortName"></el-option>
                        </el-select>
                    </span>
                     <span class="span_pr16">
                        <el-select placeholder="是否处理" v-model="searchForm.isFinish" clearable>
                            <el-option value="1" label="是"></el-option>
                            <el-option value="0" label="否"></el-option>
                        </el-select>
                    </span>
                    <span class="span_pr16">
                        <el-date-picker v-model="searchForm.updateTime" placeholder="同源时间" value-format="YYYY-MM-DD"></el-date-picker>
                    </span>
                    <span class="span_pr16">
                        <el-button :icon="Search" type="primary" @click="getTableData">查询</el-button>
                        <el-button :icon="RefreshRight" @click="resetSearchForm">重置</el-button>
                    </span>   
                </div>
                <div>
                    <span class="span_pr16">
                        <el-button :icon="Download" type="primary" @click="()=>{ __axios_api_taskCount.exportChangeList(pageConfig.getCurrentPage, pageConfig.getPageSize)}">导出</el-button>
                    </span>  
                </div>
            </div>
        </template>
        <template #tableContent>
            <div class="tableContent">
                <el-table :key="tableKey" :data="tableData" border v-loading="tableLoading" height="100%">
                    <el-table-column type="index" label="序号" width="65" align="center" :index="(index:number)=>useTableIndex(index, pageConfig.getCurrentPage, pageConfig.getPageSize)" />
                    <el-table-column align="center" prop="matterName" label="事项名称" />
                    <el-table-column align="center" prop="status" label="变更类型">
                        <template #default="scope">
                            <span v-if="scope.row.status==='1'">新增</span>
                            <span v-else-if="scope.row.status==='2'">变更</span>
                            <span v-else-if="scope.row.status==='3'">取消</span>
                            <span v-else></span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="deptName" label="实施主体" />
                    <!-- <el-table-column align="center" prop="workTypeName" label="审核流程" /> -->
                    <el-table-column align="center" prop="isFinish" label="任务状态">
                        <template #default="s">
                            <span v-if="s.row.isFinish==0">未处理</span>
                            <span v-else>已处理</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="updateTime" label="同源时间" />
                    <el-table-column align="center" fixed="right" label="操作" width="255">
                        <template #default="s">
                            <el-config-provider :button="{autoInsertSpace:false}">
                                <el-button :text="true" type="primary" @click="toMatterDetail(s.row)">查看</el-button>
                                <el-button :text="true" v-if="s.row.status==='2'" type="primary" @click="nav(`/matterChangeDetail/${s.row.rowguid}`)">查看版本</el-button>
                                <el-button v-if="s.row.status!=='3'" :text="true" type="primary" @click="alertHandler(s.row.id)">提醒</el-button>
                            </el-config-provider>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </template>
        <template #pagination>
            <div class="page_pagination">
                <el-pagination
                    background
                    :layout="pageConfig.getLayout"
                    :total="pageConfig.getTotalCount"
                    :page-sizes="pageConfig.getPageSizes"
                    :page-size="pageConfig.getPageSize"
                    :current-page="pageConfig.getCurrentPage"
                    @current-change="(c:number)=>{ pageConfig.onCurrentPageChange(c, getTableData) }" @size-change="(p:number)=>{ pageConfig.onPageSizeChange(p,getTableData) }" />
            </div>
        </template>
    </ListPageLayout>
</template>

<style scoped lang="less">

</style>