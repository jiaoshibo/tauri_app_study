<!--
 * @Author: jiaxiaorong jiaxiaorong@syngo.net
 * @Date: 2023-10-24 10:30:58
 * @LastEditors: jiaxiaorong jiaxiaorong@syngo.net
 * @LastEditTime: 2023-10-24 10:56:14
 * @FilePath: \syngo-yckt-matter-library-web\src\views\Matter\MatterList.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script lang="ts" setup>
import { ref, onBeforeMount, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { PageConfig, useTableIndex } from '@/hooks/usePageConfig'
import Layout from '@/components/ListPageLayout.vue';
import * as taskCount from "@/axios/api/taskCount";
import {ElMessage, ElMessageBox} from "element-plus";
import SituationConfigDialog from "@/components/SituationConfigDialog.vue";
import { selectCheckBoxSelect } from '@/axios/api/matterInfo';
import { Search, RefreshRight, Filter, ArrowUp } from '@element-plus/icons-vue';
import asyncPool from '@/utils/asyncPool';
import HighLevelSearch from '@/components/HighLevelSearch.vue';

onBeforeMount(() => {
    getTableData();
    asyncPool(3,[taskCount.getOrganization(), selectCheckBoxSelect('YWLX'), selectCheckBoxSelect('SZLC'), selectCheckBoxSelect('SZQY'), selectCheckBoxSelect('FLWZ'), selectCheckBoxSelect('WPGZ'), selectCheckBoxSelect('SHFS')]).then(res=>{
        if(res[0].data.code===2001){
            deptNameOptions.value = res[0].data.data
        }
        if(res[1].data.code===2001){
            matterTypeSelectOptions.value = res[1].data.data
        }

        if(res[2].data.code===2001){
            matterFloorOptions.value = res[2].data.data
        }

        if(res[3].data.code===2001){
            matterAreaOptions.value = res[3].data.data
        }

        if(res[4].data.code === 2001){
            inSystemOptions.value = res[4].data.data;
        }

        if (res[5].data.code === 2001) {
            outSystemOptions.value = res[5].data.data;
        }

        if (res[6].data.code === 2001) {
            drawingReviewMethodOptions.value = res[6].data.data;
        }
    })
})

const router = useRouter();
const route = useRoute();
const pageConfig = reactive(new PageConfig());


const bdItem = ref<string[]>(['事项管理', '全部事项'])


if(route.query.enterHall){
    if(typeof route.query.enterHall === 'string'){
        if(route.query.enterHall === '0'){
            bdItem.value[1] = '进驻事项'
        }else{
            bdItem.value[1] = '未进驻事项'
        }
    }
}

// ================= 搜索与高级搜索 👇

const highLevelSearchControl = ref(false);

let searchForm = ref<TaskCount.GetAllMatterParams>({});

/**
 * 业务类型下拉
 */
const matterTypeSelectOptions = ref<DictionaryObj[]>([])
/** 行使层级 */
const useLevelOptions = ref<{label:string;value:string}[]>([
    {
        label:'区级',value:'3'
    },
    {label:'镇街级',value:'5'},
    {label:'市级',value:'2'}
])
/** 实施主体 */
const deptNameOptions = ref<any[]>([]);
/** 事项类型 */
const taskTypeOptions = ref<{label:string;value:string}[]>([
    {label:'行政许可',value:'01'},
    {label:'行政确认',value:'07'},
    {label:'行政奖励',value:'08'},
    {label:'行政处罚',value:'02'},
    {label:'行政强制',value:'03'},
    {label:'行政征收',value:'04'},
    {label:'行政给付',value:'05'},
    {label:'行政裁决',value:'09'},
    {label:'其他行政权力',value:'10'},
    {label:'公共服务',value:'20'},
    {label:'政府内部审批',value:'30'},
    {label:'依申请便民服务',value:'31'},
    {label:'主题服务',value:'32'},
])
/** 楼层 */
const matterFloorOptions = ref<DictionaryObj[]>([]);
/** 区域 */
const matterAreaOptions = ref<DictionaryObj[]>([]);
/** 分流位置 */
const inSystemOptions = ref<DictionaryObj[]>([]);
/** 委派规则 */
const outSystemOptions = ref<DictionaryObj[]>([]);
/** 图纸审核方式 */
const drawingReviewMethodOptions = ref<DictionaryObj[]>([]);

/**
 * 重置搜索
 */
function resetSearchForm() {
    searchForm.value = {};
    getTableData()
}


function closeDrawer(){
    highLevelSearchControl.value = false;
}

// ================= 搜索与高级搜索 👆





// =============================================表格 👇

const tableLoading = ref<boolean>(false)
const tableData = ref<any[]>([]);
const tableKey = ref<number>(1);


function getTableData(isHighLevelSearch?:boolean) {
    tableKey.value++;
    tableLoading.value = true
    let params:TaskCount.GetAllMatterParams = {
        pageNo:pageConfig.getCurrentPage,
        pageSize:pageConfig.getPageSize,
        ...searchForm.value
    }
    if(route.query.enterHall && typeof route.query.enterHall === 'string'){
        params.enterHall = route.query.enterHall
    }
    taskCount.allMatter(params).then(res=>{
        let resData = res.data;
        if(resData.code===2001){
            tableData.value = resData.data.list;
            pageConfig.setTotalCount = resData.data.total;
        }else{
            ElMessage.error(resData.message)
        }
    }).finally(()=>{
        tableLoading.value = false;
        if(isHighLevelSearch) highLevelSearchControl.value=false;
    })
}



/**
 * 事项上架下架
 * @param id
 * @param op
 */
async function taskOnOff(id:string,op:'on'|'off'){
    try{
        let text = op==='on'?'上架':'下架'
        await ElMessageBox.confirm(`确认${text}事项`,'提示',{
            confirmButtonText:'确定',
            cancelButtonText:'取消',
            type:'warning'
        })

        let res = op==='on'?await taskCount.taskOn(id):await taskCount.taskOff(id)
        let result = res.data
        if(result.code===2001){
            if(result.data===1){
                ElMessage.success(`事项${text}成功`)
                getTableData();
            }else{
                ElMessage.error(`事项${text}失败`)
            }
        }

    }catch (e) {
        if(e!=='cancel'){
            ElMessage.error('服务器错误')
            console.error(e)
        }
    }
}
// ================================================表格 👆




/**
 * 查看界面
 * @param row 
 */
function checkClick(row: any) {
    router.push({
        path: "/matterDetails",
        query: {
            id: row.id,
            matterId: row.matterId,
            situationId: row.situationId,
            situationName: row.situationName,
            matterName: row.matterName,
            // enterHall 0 进驻事项 1 未进驻事项
            type: row.enterHall==='0'?'1':'3'
        }
    })
}



const SituationConfigDialogRef = ref<InstanceType<typeof SituationConfigDialog>>();


function openSitDialog (row:any, flag:'1'|'0') {
    console.log('flag:::',flag);
    if(flag==='0') SituationConfigDialogRef.value?.contentSet(row)
}



</script>

<template>
    <layout :breadcrumb-item="bdItem">
        <template #searchCard>
            <div class="search_card with-high-level-search">
                <div>
                    <span class="span_pr16">
                        <el-select placeholder="选择业务类型名称" v-model="searchForm.workTypeName" clearable>
                            <el-option v-for="item in matterTypeSelectOptions" :key="item.value" :label="item.content" :value="item.content" />
                        </el-select>
                    </span>
                    <span class="span_pr16">
                        <el-input v-model="searchForm.matterName" placeholder="输入事项名称" clearable />
                    </span>
                    <span class="span_pr16">
                        <el-select placeholder="行使层级" v-model="searchForm.useLevel" clearable>
                            <el-option v-for="item in useLevelOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </span>
                    <span class="span_pr16">
                        <el-select placeholder="实施主体" v-model="searchForm.deptName" clearable>
                            <el-option v-for="item in deptNameOptions" :key="item.id" :label="item.orgName" :value="item.orgName"></el-option>
                        </el-select>
                    </span>
                    <span class="span_pr16">
                        <el-button type="primary" :icon="Search" @click="getTableData()">查询</el-button>
                        <el-button :icon="RefreshRight" @click="resetSearchForm">重置</el-button>
                        <el-button type="primary" plain :icon="Filter" @click="()=>{highLevelSearchControl=true}">高级搜索</el-button>
                    </span>
                </div>
                <!-- 高级搜索 -->
                <HighLevelSearch :open="highLevelSearchControl">
                    <div class="high-level-search-form">
                        <el-form label-width="100px">
                            <el-row>
                                <el-col :xl="6" :lg="8" :md="12" :sm="24">
                                    <el-form-item label="业务类型">
                                        <el-select placeholder="选择业务类型名称" v-model="searchForm.workTypeName" clearable>
                                            <el-option v-for="item in matterTypeSelectOptions" :key="item.value" :label="item.content" :value="item.content" />
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :xl="6" :lg="8" :md="12" :sm="24">
                                    <el-form-item label="事项名称">
                                        <el-input v-model="searchForm.matterName" placeholder="输入事项名称" clearable />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </div>
                    <div class="dialog-title--global">
                        同源条件
                    </div> 
                    <div class="high-level-search-form">
                        <el-form label-width="100px">
                            <el-row>
                                <el-col :xl="6" :lg="8" :md="12" :sm="24">
                                    <el-form-item label="行使层级">
                                        <el-select v-model="searchForm.useLevel" clearable>
                                            <el-option v-for="item in useLevelOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :xl="6" :lg="8" :md="12" :sm="24">
                                    <el-form-item label="实施主体">
                                        <el-select v-model="searchForm.deptName" clearable>
                                            <el-option v-for="item in deptNameOptions" :key="item.id" :label="item.orgName" :value="item.orgName"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :xl="6" :lg="8" :md="12" :sm="24">
                                    <el-form-item label="事项类型">
                                        <el-select v-model="searchForm.taskType" clearable>
                                            <el-option v-for="item in taskTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :xl="6" :lg="8" :md="12" :sm="24">
                                    <el-form-item label="依申请">
                                        <el-select v-model="searchForm.taskTypeClassify" clearable>
                                            <el-option label="是" :value="1"></el-option>
                                            <el-option label="否" :value="0"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :xl="6" :lg="8" :md="12" :sm="24">
                                    <el-form-item label="是否收费">
                                        <el-select v-model="searchForm.isFee" clearable>
                                            <el-option label="是" :value="1"></el-option>
                                            <el-option label="否" :value="0"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </div>
                    <div class="dialog-title--global" v-if="$route.query.enterHall!=='1'">
                        人工维护条件
                    </div> 
                    <div class="high-level-search-form" v-if="$route.query.enterHall !== '1'">
                        <el-form label-width="100px">
                            <el-row>
                                <el-col :xl="6" :lg="8" :md="12" :sm="24">
                                    <el-form-item label="所在楼层">
                                        <el-select v-model="searchForm.matterFloor" clearable>
                                            <el-option v-for="item in matterFloorOptions" :key="item.value" :label="item.content" :value="item.content"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :xl="6" :lg="8" :md="12" :sm="24">
                                    <el-form-item label="所在区域">
                                        <el-select v-model="searchForm.matterArea" clearable>
                                            <el-option v-for="item in matterAreaOptions" :key="item.value" :label="item.content" :value="item.content"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :xl="6" :lg="8" :md="12" :sm="24">
                                    <el-form-item label="分流位置">
                                        <el-select v-model="searchForm.inSystem" clearable>
                                            <el-option v-for="item in inSystemOptions" :key="item.value" :label="item.content" :value="item.value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :xl="6" :lg="8" :md="12" :sm="24">
                                    <el-form-item label="委派规则">
                                        <el-select v-model="searchForm.outSystem" clearable>
                                            <el-option v-for="item in outSystemOptions" :key="item.value" :label="item.content" :value="item.value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :xl="6" :lg="8" :md="12" :sm="24">
                                    <el-form-item label="是否多情形">
                                        <el-select v-model="searchForm.isStation" clearable>
                                            <el-option label="是" :value="1"></el-option>
                                            <el-option label="否" :value="0"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :xl="6" :lg="8" :md="12" :sm="24">
                                    <el-form-item label="全程网办">
                                        <el-select v-model="searchForm.isWeb" clearable>
                                            <el-option label="是" value="是"></el-option>
                                            <el-option label="否" value="否"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :xl="6" :lg="8" :md="12" :sm="24">
                                    <el-form-item label="需要图纸">
                                        <el-select v-model="searchForm.drawingRequired" clearable>
                                            <el-option :value="1" label="是"></el-option>
                                            <el-option :value="0" label="否"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :xl="6" :lg="8" :md="12" :sm="24">
                                    <el-form-item label="图纸审核方式">
                                        <el-select v-model="searchForm.drawingReviewMethod" clearable>
                                            <el-option v-for="item in drawingReviewMethodOptions" :key="item.value" :label="item.content" :value="item.content"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :xl="6" :lg="8" :md="12" :sm="24">
                                    <el-form-item label="是否中台审核">
                                        <el-select v-model="searchForm.isMiddleMaterial" clearable>
                                            <el-option label="是" :value="1"></el-option>
                                            <el-option label="否" :value="0"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :xl="6" :lg="8" :md="12" :sm="24">
                                    <el-form-item label="是否高频">
                                        <el-select v-model="searchForm.isRepeat" clearable>
                                            <el-option label="是" :value="1"></el-option>
                                            <el-option label="否" :value="0"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :xl="6" :lg="8" :md="12" :sm="24">
                                    <el-form-item label="更新时间" clearable>
                                        <el-date-picker placeholder="请选择" v-model="searchForm.updateTime" value-format="YYYY-MM-DD"></el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :xl="6" :lg="8" :md="12" :sm="24">
                                    <el-form-item label="是否进驻事项">
                                        <el-select v-model="searchForm.enterHall" clearable>
                                            <el-option label="进驻事项" value="0"></el-option>
                                            <el-option label="未进驻事项" value="1"></el-option>
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
                </HighLevelSearch>
            </div>
        </template>
        <template #tableContent>
            <div class="tableContent">
                <el-table :key="tableKey" :data="tableData" border height="100%" v-loading="tableLoading">
                    <el-table-column type="index" label="序号" width="65" align="center"
                        :index="(index: number) => useTableIndex(index, pageConfig.getCurrentPage, pageConfig.getPageSize)" />
                    <el-table-column align="center" prop="matterName" label="事项名称" />
                    <!-- <el-table-column align="center" prop="workTypeName" label="业务类型名称" /> -->
                    <el-table-column align="center" prop="deptName" label="实施主体" />
                    <el-table-column align="center" prop="repeatName" label="是否高频" />
                    <el-table-column align="center" prop="webName" label="是否全程网办" />
                    <el-table-column align="center" prop="matterFloor" label="所在楼层" />
                    <el-table-column align="center" prop="matterArea" label="所在区域" />
                    <el-table-column align="center" prop="updatedTime" label="同源时间" />
                    <el-table-column align="center" fixed="right" label="操作" width="190">
                        <template #default="scope">
                            <el-config-provider :button="{autoInsertSpace:false}">
                                <el-button :text='true' type="primary" @click="checkClick(scope.row)">查看</el-button>
                                <!-- 暂时隐藏上架下架 -->
                                <!-- <el-button type="text" @click="taskOnOff(scope.row.id, scope.row.isDelete === '0' ? 'off' : 'on')">{{ scope.row.isDelete === '0' ? '下架' : '上架' }}</el-button> -->
                                <el-button 
                                :style="{visibility: scope.row.situationFlag === '0'? 'visible':'hidden'}" 
                                :text='true' type="primary"
                                @click="openSitDialog(scope.row, scope.row.situationFlag)">
                                    <span>情形配置</span>
                                </el-button>
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
                    :current-page="pageConfig.getCurrentPage" @current-change="(c: number)=>pageConfig.onCurrentPageChange(c,getTableData)"
                    @size-change="(p: number)=>{pageConfig.onPageSizeChange(p, getTableData)}" />
            </div>
        </template>
    </layout>
    <!-- 情形配置 -->
    <SituationConfigDialog ref="SituationConfigDialogRef" />
</template>

<style scoped lang="less">
.high-level-search-form{
    margin-top: 18px;
    padding-right: 18px;
}


.with-high-level-search{
    position: relative;
}
</style>