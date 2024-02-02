<!-- 事项分流配置 -->
<script lang="ts" setup>
import { ref, onBeforeMount, reactive } from 'vue';
import ListPageLayout from '@/components/ListPageLayout.vue';
import { PageConfig, useTableIndex } from '@/hooks/usePageConfig';
import * as __axios_api_taskCount from "@/axios/api/taskCount";
import {ElMessage, ElMessageBox} from "element-plus";
import MatterRule from '@/components/MatterRule.vue'
import * as __axios_api_backBmgAssingRule from '@/axios/api/backBmgAssingRule';
import { Search, RefreshRight, Plus } from '@element-plus/icons-vue';
import { selectCheckBoxSelect } from '@/axios/api/matterInfo';


onBeforeMount(()=>{
    getTableData();
    getRuleNameOptions();
})

/**
 * 分页配置
 */
const pageConfig = reactive<PageConfig>(new PageConfig());


/** 分流名称 */
const ruleNameOptions = ref<DictionaryObj[]>([])

/**
 * 获取分流名称字典列表
 */
function getRuleNameOptions(){
    ruleNameOptions.value = [];
    selectCheckBoxSelect('FLWZ').then(res=>{
        if(res.data.code===2001){
            ruleNameOptions.value = res.data.data;
            return selectCheckBoxSelect('WPGZ')
        }else{
            return Promise.reject(res.data)
        }
    }).then(res=>{
        if (res.data.code === 2001) {
            res.data.data.forEach(item=>{
                ruleNameOptions.value.push(item)
            })
        } else {
            return Promise.reject(res.data)
        }
    }).catch(err=>{
        console.error('getRuleNameOptions:::',err);
    })
}

// 表格 👇
const tableLoading = ref<boolean>(false);
const tableData = ref<__axios_api_taskCount.GetAssignRuleListResponse['list']>([]);
const tableKey = ref(1);


let searchForm = reactive<Partial<TaskCount.GetAssignRuleListRequest>>({})

/**
 * 重置搜索
 */
function resetSearchForm(){
    searchForm = reactive({});
    getTableData()
}
/**
 * 获取列表
 */
function getTableData(){
    tableKey.value++;
    tableLoading.value = true;
    let params: TaskCount.GetAssignRuleListRequest = {
        pageNo:pageConfig.getCurrentPage,
        pageSize:pageConfig.getPageSize,
    }
    let i:keyof typeof searchForm;
    for(i in searchForm){
        if(searchForm[i] && i!=='pageNo' && i!=='pageSize'){
            params[i] = searchForm[i]
        }
    }
    __axios_api_taskCount.getAssignRuleList(params).then(res=>{
        let result = res.data;
        if(result.code===2001){
            tableData.value = result.data.list;
            pageConfig.setTotalCount = result.data.total;
        }else{
            ElMessage.error(result.message)
        }
    }).catch(()=>{
        ElMessage.error('服务器错误')
    }).finally(()=>{
        tableLoading.value = false;
    })
}
/**
 * 删除当前分流配置
 * @param id 
 */
function deleteItem (id:string){
    ElMessageBox.confirm('确认删除当前分流配置？','提示',{
        type:'warning'
    }).then(()=>{
        __axios_api_backBmgAssingRule.backBmgAssignRule(id,'axiosDelete').then(res => {
            if(res.data.code===2001){
                if(res.data.data){
                    ElMessage.success('删除成功');
                    getTableData();
                }else{
                    ElMessage.error('删除失败')
                }
            }else{
                ElMessage.error('删除失败')
            }
        })
    })
}


function editClick(id:string){

}

// 表格 👆

// dialog 👇

const MatterRuleRef = ref<InstanceType<typeof MatterRule>>();

function onOpenDialog(){
    // dialogConfig.visible = true

    MatterRuleRef.value?.addClick();
}

function openEditDialog(id:string){
    MatterRuleRef.value?.editClick(id)
}




// dialog 👆

</script>

<template>
    <ListPageLayout :breadcrumb-item="['事项管理','事项分流配置']">
        <template #searchCard>
            <div class="search_card">
                <div class="search_operations">
                    <span class="span_pr16">
                        <el-select v-model="searchForm.name" placeholder="分流名称" clearable>
                            <el-option v-for="item in ruleNameOptions" :key="item.value" :label="item.content" :value="item.value"></el-option>
                        </el-select>
                    </span>
                    <span class="span_pr16">
                        <el-input v-model="searchForm.createBy" placeholder="创建人" clearable />
                    </span>
                    <span class="span_pr16">
                        <el-date-picker v-model="searchForm.createdTime" placeholder="创建时间" value-format="YYYY-MM-DD" clearable />
                    </span>
                    <span class="span_pr16">
                        <el-button :icon="Search" type="primary" @click="getTableData">查询</el-button>
                        <el-button :icon="RefreshRight" @click="resetSearchForm">重置</el-button>
                    </span>
                </div>
                <div class="table_operations">
                    <span class="span_pr16">
                        <el-button :icon="Plus" type="primary" @click="onOpenDialog">新增</el-button>
                    </span>
                </div>
            </div>
        </template>
        <template #tableContent>
            <div class="tableContent">
                <el-table :key="tableKey" :data="tableData" border :center="true" v-loading="tableLoading" height="100%">
                    <el-table-column type="index" label="序号" width="55" align="center" :index="(index:number)=>useTableIndex(index, pageConfig.getCurrentPage, pageConfig.getPageSize)" />
                    <el-table-column align="center" label="分流类型">
                        <template #default="s">
                            <span v-if="s.row.type==1">预约分流</span>
                            <span v-else>委派分流</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="ruleName" label="分流名称"></el-table-column>
                    <el-table-column align="center" label="是否高频">
                        <template #default="s">
                            <span v-if="s.row.isRepeat===1">是</span>
                            <span v-else>否</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="优先级" prop="assignOrder"></el-table-column>
                    <el-table-column align="center" prop="viewExpression" label="函数名称" />
                    <el-table-column align="center" prop="createdTime" label="创建时间" />
                    <el-table-column align="center" prop="createdBy" label="创建者" />
                    <el-table-column align="center" fixed="right" label="操作" width="180">
                        <template #default="s">
                            <el-config-provider :button="{autoInsertSpace:false}">
                                <el-button :text="true" type="primary" @click="openEditDialog(s.row.id)">修改</el-button>
                                <el-button :text="true" type="danger" @click="deleteItem(s.row.id)">删除</el-button>
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
                    @current-change="(c:number)=>{pageConfig.onCurrentPageChange(c,getTableData)}" @size-change="(p:number)=>{pageConfig.onPageSizeChange(p, getTableData)}" />
            </div>
        </template>
    </ListPageLayout>

    <MatterRule ref="MatterRuleRef" @ok="getTableData()" />





    <!-- <el-dialog v-model="dialogConfig.visible" :close-on-click-modal="dialogConfig.closeOnClickModal" :close-on-press-escape="dialogConfig.closeOnPressEscpe" :draggable="dialogConfig.draggable">
        <template #header>
            <div class="dialog-title--global">
                新增
            </div>
        </template>
        <div class="dialog-content">
            <el-form size="large">
                <el-form-item label="规则名称">
                    <el-input></el-input>
                </el-form-item>
                <el-form-item label="函数名称">
                    <el-row :gutter="8" class="page-el-row">
                        <el-col :span="6">
                            <el-input value="字段名称" disabled ></el-input>
                        </el-col>
                        <el-col :span="6">
                            <el-input value="规则配置" disabled ></el-input>
                        </el-col>
                        <el-col :span="6">
                            <el-input value="字段名称" disabled ></el-input>
                        </el-col>
                        <el-col :span="6">
                            <el-input value="依赖字段" disabled ></el-input>
                        </el-col>
                    </el-row>
                    <el-row :gutter="8" class="page-el-row">
                        <el-col :span="6">
                            <el-select placeholder="选择字段名称"></el-select>
                        </el-col>
                        <el-col :span="6">
                            <el-select placeholder="规则配置"></el-select>
                        </el-col>
                        <el-col :span="6">
                            <el-input></el-input>
                        </el-col>
                        <el-col :span="6">
                            <el-input></el-input>
                        </el-col>
                        <div class="operation-button">
                            <el-icon><Minus /></el-icon>
                        </div>
                    </el-row>
                    <div class="operation-button-add">
                        <el-icon><Plus /></el-icon>&nbsp;新增
                    </div>
                </el-form-item>
            </el-form>
        </div>

        <template #footer>
            <el-button @click="onCloseDialog">取消</el-button>
            <el-button type="primary" @click="onCloseDialog">保存</el-button>
        </template>

    </el-dialog> -->
</template>

<style lang="less" scoped>
.page-el-row{
  margin-bottom: 10px;
  position: relative;
  .operation-button{
    cursor: pointer;
    border: 1px dashed #EA0000;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    color:#EA0000;
    right: -48px;
    width: 40px;
    height: 40px;
    box-sizing: border-box;
  }
}
.dialog-content{
  padding-right: 48px;
  .operation-button-add{
    cursor: pointer;
    justify-content: center;
    display: flex;
    align-items: center;
    height: 40px;
    width: 100%;
    border: 1px dashed var(--el-color-primary);
    color: var(--el-color-primary);
  }
}
</style>