<script lang="ts" setup>
import { ref, onBeforeMount, reactive } from 'vue';
import { useRouter } from 'vue-router';
import ListPageLayout from '@/components/ListPageLayout.vue';
import { PageConfig, useTableIndex } from '@/hooks/usePageConfig';
import SituationConfigDialog from '@/components/SituationConfigDialog.vue';
import * as __axios_api_taskCount from '@/axios/api/taskCount';
import { selectCheckBoxSelect } from '@/axios/api/matterInfo';
import { Search, RefreshRight } from '@element-plus/icons-vue';

onBeforeMount(()=>{
    getTableData();
})


const router = useRouter();

// =============== 搜索 👇

/**
 * 业务类型下拉
 */
const matterTypeSelectOptions = ref<DictionaryObj[]>([])

function onGetMatterTypeSelectOptions(){
    selectCheckBoxSelect('YWLX').then(res=>{
        if(res.data.code===2001){
            matterTypeSelectOptions.value = res.data.data
        }
    })
}

// ============== 搜索 👆


// =========== 表格 👇

const pageConfig = reactive(new PageConfig())

const tableData = ref<any[]>([]);
const tableLoading = ref(false);
const tableKey = ref(1);

let searchForm = reactive<Partial<TaskCount.AllSetterMatterRequest>>({})

function getTableData(){
    tableKey.value++;
    tableLoading.value = true;
    let params: TaskCount.AllSetterMatterRequest = {
        pageNo:pageConfig.getCurrentPage,
        pageSize:pageConfig.getPageSize,
        ...searchForm
    }
    
    __axios_api_taskCount.allSetterMatter(params).then(res=>{
        if(res.data.code===2001){
            tableData.value = res.data.data.list;
            pageConfig.setTotalCount = res.data.data.total;
        }
    }).finally(()=>{
        tableLoading.value = false;
    })
}


function resetSearchForm(){
    searchForm = reactive({});

    getTableData()
}

// ========== 表格 👆

function getDetail(id:string,readonly?:true){
    if(readonly){
        router.push(`/addNonPublicMatter/view/${id}`)
    }else{
        router.push(`/addNonPublicMatter/edit/${id}`)
    }
}

const SituationConfigDialogRef = ref<InstanceType<typeof SituationConfigDialog>>();



</script>

<template>
    <ListPageLayout :breadcrumb-item="['事项管理','非公服事项管理']">
        <template #searchCard>
            <div class="search_card">
                <div>
                    <span class="span_pr16">
                        <el-select placeholder="选择业务类型名称" v-model="searchForm.workTypeName" clearable @focus="onGetMatterTypeSelectOptions()">
                            <el-option v-for="item in matterTypeSelectOptions" :key="item.value" :label="item.content" :value="item.value"></el-option>
                        </el-select>
                    </span>
                    <span class="span_pr16">
                        <el-input placeholder="输入事项名称" v-model.trim="searchForm.matterName" />
                    </span>
                    <span class="span_pr16">
                        <el-button type="primary" :icon="Search" @click="getTableData">查询</el-button>
                        <el-button :icon="RefreshRight" @click="resetSearchForm">重置</el-button>
                    </span>     
                </div>
            </div>
        </template>
        <template #tableContent>
            <div class="tableContent">
                <el-table :key="tableKey" :data="tableData" border :center="true" v-loading="tableLoading" height="100%">
                    <el-table-column type="index" label="序号" width="55" align="center" :index="(index:number)=>useTableIndex(index, pageConfig.getCurrentPage, pageConfig.getPageSize)" />
                    <!-- <el-table-column prop="matterCatName" label="事项大类"></el-table-column> -->
                    <el-table-column align="center" prop="matterName" label="事项名称" />
                    <el-table-column align="center" prop="workTypeName" label="业务类型名称" /> 
                    <el-table-column align="center" prop="deptName" label="实施主体" />
                    <el-table-column align="center" prop="matterFloor" label="所在楼层" />
                    <el-table-column align="center" prop="matterArea" label="所在区域" />
                    <el-table-column align="center" prop="updatedTime" label="更新时间" />
                    <el-table-column align="center" fixed="right" label="操作" width="180">
                        <template #default="s">
                            <el-config-provider :button="{autoInsertSpace:false}">
                                <el-button :text="true" type="primary" @click="getDetail(s.row.id, true)">查看</el-button>
                                <el-button :text="true" type="primary" @click="getDetail(s.row.id)">编辑</el-button>
                            </el-config-provider>
                            <!-- <el-button type="text" @click="configSit">情形配置</el-button> -->
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
                    @current-change="(c:number)=>{pageConfig.onCurrentPageChange(c, getTableData)}" @size-change="(p:number)=>{pageConfig.onPageSizeChange(p,getTableData)}" />
            </div>
        </template>
    </ListPageLayout>
    <SituationConfigDialog ref="SituationConfigDialogRef" />
</template>

<style lang="less" scoped>

</style>