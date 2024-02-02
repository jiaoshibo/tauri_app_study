<script setup lang="ts">
import {reactive, ref, onBeforeMount} from 'vue';
import { useRouter,useRoute } from 'vue-router';
import { PageConfig, useTableIndex } from '@/hooks/usePageConfig'
import ListPageLayout from '@/components/ListPageLayout.vue';
import { ElMessage } from "element-plus";
import { byMainId } from "@/axios/api/taskCount";
import type { TableInstance } from 'element-plus'
import { Switch } from '@element-plus/icons-vue';


const router = useRouter();
const route = useRoute();

onBeforeMount(()=>{
    getTableData()
})

let matterMainId = route.params.matterMainId;

const pageConfig = reactive(new PageConfig());

const tableData = ref<any[]>([]);
const tableKey = ref(1);
const tableSelection = ref<any[]>([])
const tableLoading = ref(false);

function getTableData(){
    tableKey.value++;
    tableLoading.value = true;
    byMainId({
        pageNum:pageConfig.getCurrentPage,
        pageSize:pageConfig.getPageSize,
        matterId:matterMainId as string
    }).then(res=>{
        if(res.data.code===2001){
            tableData.value = res.data.data.list;
            pageConfig.setTotalCount = res.data.data.total;
        }
    }).catch(err=>{
        console.log('getTableData:::',err)
        ElMessage.error('服务器错误')
    }).finally(()=>{
        tableLoading.value = false;
    })
}



const onTableSelection: TableInstance['onSelection-change'] = v=>{
    tableSelection.value = v;
}

function toVersionComparsion(){
    let obj:TaskCount.CompareSyncMatterRequest = {
        taskGuid: tableSelection.value[0].rowGuid,
        taskCode: tableSelection.value[0].taskCode,
        taskType: tableSelection.value[0].taskType,
        cdBatchArr: []
    }
    tableSelection.value.forEach(item=>{
        obj.cdBatchArr.push(item.cdBatch)
    })
    router.push(
        {
            path:'/versionComparsion',
            query:{
                ...obj,
                id:tableSelection.value[0].matterId,
                matterId:tableSelection.value[0].matterId,
                matterName:tableSelection.value[0].matterName,
                situationId:'',
                situationName:''
            }
        }
    )
}


function checkout(row:any){
    router.push({
        path: "/matterDetails",
        query: {
            id: row.id,
            matterId: row.matterId,
            matterName: row.matterName,
            situationId: '',
            situationName: '',
            type: '4'
        }
    })
}
</script>

<template>
    <ListPageLayout :breadcrumb-item="['事项管理','事项异动','查看版本']">
        <template #searchCard>
            <div class="search_card">
                <span class="span_pr16">
                    <el-button type="primary" :icon="Switch" :disabled="tableSelection.length!==2" @click="toVersionComparsion()">版本对比</el-button>
                </span>   
            </div>
        </template>
        <template #tableContent>
            <div class="tableContent">
                <el-table :key="tableKey" v-loading="tableLoading" :data="tableData" border @selection-change="onTableSelection">
                    <el-table-column type="index" label="序号" width="55" align="center" :index="(index:number)=>useTableIndex(index, pageConfig.getCurrentPage, pageConfig.getPageSize)" />
                    <el-table-column prop="matterName" label="办理事项名称" align="center" />
                    <el-table-column prop="taskTypeText" label="事项类型" align="center" />
                    <el-table-column prop="useLevel" label="行使层级" align="center" />
                    <el-table-column prop="taskVersion" label="版本号" align="center" />
                    <el-table-column type="selection" width="55" align="center" />
                </el-table>
            </div>
        </template>
        <template #pagination>
            <div class="page_pagination">
                <el-pagination
                    background
                    :layout="pageConfig.getLayout"
                    :total="pageConfig.getTotalCount"
                    :page-size="pageConfig.getPageSize"
                    :page-sizes="pageConfig.getPageSizes"
                    :current-page="pageConfig.getCurrentPage"
                    @current-change="(c:number)=>{pageConfig.onCurrentPageChange(c,getTableData)}"
                    @size-change="(p:number)=>{pageConfig.onPageSizeChange(p,getTableData)}"
                />
            </div>
        </template>
    </ListPageLayout>
</template>

<style scoped lang="less">

</style>