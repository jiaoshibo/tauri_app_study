<!-- 未进驻事项列表 -->
<script lang="ts" setup>
import { ref, onBeforeMount, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { PageConfig, useTableIndex } from '@/hooks/usePageConfig'
import Layout from '@/components/ListPageLayout.vue';
import * as taskCount from "@/axios/api/taskCount";
import { ElMessage } from "element-plus";
import { selectCheckBoxSelect } from '@/axios/api/matterInfo';
import { Search, RefreshRight, Filter, ArrowUp } from '@element-plus/icons-vue';
import asyncPool from '@/utils/asyncPool';
import HighLevelSearch from '@/components/HighLevelSearch.vue';

onBeforeMount(() => {
    getTableData();
    asyncPool(3, [taskCount.getOrganization(), selectCheckBoxSelect('use_level'), selectCheckBoxSelect('task_type')]).then(res => {
        if (res[0].data.code === 2001) {
            deptNameOptions.value = res[0].data.data
        }
        if (res[1].data.code === 2001) {
            useLevelOptions.value = res[1].data.data
        }

        if (res[2].data.code === 2001) {
            taskTypeOptions.value = res[2].data.data;
        }
    })
})

const router = useRouter();
const pageConfig = reactive(new PageConfig());

// ================= 搜索与高级搜索 👇

const highLevelSearchControl = ref(false);

let searchForm = ref<TaskCount.GetAllMatterParams>({});

/** 行使层级 */
const useLevelOptions = ref<DictionaryObj[]>([]);
/** 实施主体 */
const deptNameOptions = ref<any[]>([]);
/** 事项类型 */
const taskTypeOptions = ref<DictionaryObj[]>([]);

/**
 * 重置搜索
 */
function resetSearchForm() {
    searchForm.value = {};
    getTableData()
}


function closeDrawer() {
    highLevelSearchControl.value = false;
}

// ================= 搜索与高级搜索 👆





// =============================================表格 👇

const tableLoading = ref<boolean>(false)
const tableData = ref<any[]>([]);


function getTableData(isHighLevelSearch?: boolean) {
    tableLoading.value = true
    let params: TaskCount.GetAllMatterParams = {
        pageNo: pageConfig.getCurrentPage,
        pageSize: pageConfig.getPageSize,
        ...searchForm.value
    }

    taskCount.allUnSetterMatter(params).then(res => {
        let resData = res.data;
        if (resData.code === 2001) {
            tableData.value = resData.data.list;
            pageConfig.setTotalCount = resData.data.total;
        } else {
            ElMessage.error(resData.message)
        }
    }).finally(() => {
        tableLoading.value = false;
        if (isHighLevelSearch) highLevelSearchControl.value = false;
    })
}


// ================================================表格 👆




// 查看界面
function checkClick(row: any) {
    router.push({
        path: "/matterDetails",
        query: {
            id: row.id,
            matterId: row.matterId,
            situationId: row.situationId,
            situationName: row.situationName,
            matterName: row.matterName,
            type: '3'
        }
    })
}

</script>


<template>
    <layout :breadcrumb-item="['事项管理', '事项情形管理']">
        <template #searchCard>
            <div class="search_card with-high-level-search">
                <div>
                    <span class="span_pr16">
                        <el-input v-model="searchForm.matterName" placeholder="输入事项名称" />
                    </span>
                    <span class="span_pr16">
                        <el-select placeholder="行使层级" v-model="searchForm.useLevel">
                            <el-option v-for="item in useLevelOptions" :key="item.value" :label="item.content"
                                :value="item.value"></el-option>
                        </el-select>
                    </span>
                    <span class="span_pr16">
                        <el-select placeholder="实施主体" v-model="searchForm.deptName">
                            <el-option v-for="item in deptNameOptions" :key="item.id" :label="item.orgName"
                                :value="item.orgName"></el-option>
                        </el-select>
                    </span>
                    <span class="span_pr16">
                        <el-button type="primary" :icon="Search" @click="getTableData()">查询</el-button>
                        <el-button :icon="RefreshRight" @click="resetSearchForm">重置</el-button>
                        <el-button type="primary" plain :icon="Filter"
                            @click="() => { highLevelSearchControl = true }">高级搜索</el-button>
                    </span>
                </div>

                <high-level-search :open="highLevelSearchControl">
                    <div class="dialog-title--global">
                        同源条件
                    </div>
                    <div class="high-level-search-form">
                        <el-form label-width="120px">
                            <el-row>
                                <el-col :xl="6" :lg="8" :md="12" :sm="24">
                                    <el-form-item label="行使层级">
                                        <el-select v-model="searchForm.useLevel">
                                            <el-option v-for="item in useLevelOptions" :key="item.value"
                                                :label="item.content" :value="item.value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :xl="6" :lg="8" :md="12" :sm="24">
                                    <el-form-item label="实施主体">
                                        <el-select v-model="searchForm.deptName">
                                            <el-option v-for="item in deptNameOptions" :key="item.id" :label="item.orgName"
                                                :value="item.orgName"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :xl="6" :lg="8" :md="12" :sm="24">
                                    <el-form-item label="事项类型">
                                        <el-select v-model="searchForm.taskType">
                                            <el-option v-for="item in taskTypeOptions" :key="item.value"
                                                :label="item.content" :value="item.value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :xl="6" :lg="8" :md="12" :sm="24">
                                    <el-form-item label="依申请">
                                        <el-select v-model="searchForm.taskTypeClassify">
                                            <el-option label="是" :value="1"></el-option>
                                            <el-option label="否" :value="0"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :xl="6" :lg="8" :md="12" :sm="24">
                                    <el-form-item label="是否收费">
                                        <el-select v-model="searchForm.isFee">
                                            <el-option label="是" :value="1"></el-option>
                                            <el-option label="否" :value="0"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </div>
                    <template #footer>
                        <el-button :icon="Search" type="primary" @click="getTableData(true)">查询</el-button>
                        <el-button :icon="RefreshRight" @click="resetSearchForm">重置</el-button>
                        <el-button :icon="ArrowUp" @click="closeDrawer">收起</el-button>
                    </template>
                </high-level-search>
            </div>
        </template>
        <template #tableContent>
            <div class="tableContent">
                <el-table :data="tableData" border height="100%" v-loading="tableLoading">
                    <el-table-column type="index" label="序号" width="55" align="center"
                        :index="(index: number) => useTableIndex(index, pageConfig.getCurrentPage, pageConfig.getPageSize)" />
                    <el-table-column align="center" prop="matterName" label="事项名称" />
                    <!-- <el-table-column align="center" prop="workTypeName" label="业务类型名称" /> -->
                    <el-table-column align="center" prop="deptName" label="实施主体" />
                    <el-table-column align="center" prop="updatedTime" label="同源时间" />
                    <el-table-column align="center" fixed="right" label="操作" width="180">
                        <template #default="scope">
                            <el-config-provider :button="{ autoInsertSpace: false }">
                                <el-button type="text" @click="checkClick(scope.row)">查看</el-button>
                            </el-config-provider>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </template>
        <template #pagination>
            <div class="page_pagination">
                <el-pagination background :layout="pageConfig.getLayout" :total="pageConfig.getTotalCount"
                    :page-sizes="pageConfig.getPageSizes" :page-size="pageConfig.getPageSize"
                    :current-page="pageConfig.getCurrentPage"
                    @current-change="(c: number) => pageConfig.onCurrentPageChange(c, getTableData)"
                    @size-change="(p: number) => { pageConfig.onPageSizeChange(p, getTableData) }" />
            </div>
        </template>
    </layout>
</template>

<style scoped lang="less">
.high-level-search-form {
    margin-top: 18px;
    padding-right: 18px;
}

.with-high-level-search {
    position: relative;
}
</style>