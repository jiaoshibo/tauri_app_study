<!-- 关联绑定 -->
<script setup lang="ts">
import { ref, onBeforeMount, reactive } from 'vue';
import { useTableIndex, PageConfig } from '@/hooks/usePageConfig'
import ListPageLayout from '@/components/ListPageLayout.vue';
import {useDialogConfig} from "@/hooks/useDialogConfig";
import {ElTree, ElMessage, ElMessageBox} from 'element-plus';
import * as __axios_api_bmgBinDing from "@/axios/api/bmgBinDing";
import * as __axios_api_taskCount from '@/axios/api/taskCount';
import { Search, RefreshRight, Plus } from '@element-plus/icons-vue';


onBeforeMount(()=>{
    getTableData()
})

const pageConfig = reactive<PageConfig>(new PageConfig());

const dialogConfig = useDialogConfig();
// 表格 👇
const tableData = ref<any[]>([]);
const tableLoading = ref(false);
const tableKey = ref<number>(1);

let searchForm = reactive<Partial<__axios_api_bmgBinDing.GetBindingRequest>>({})

function resetSearchForm(){
    searchForm = reactive({});
    getTableData();
}

async function getTableData(){
    tableKey.value++;
    try {
        tableLoading.value = true;

        let params:__axios_api_bmgBinDing.GetBindingRequest = {
            pageNum:pageConfig.getCurrentPage,
            pageSize:pageConfig.getPageSize,
            ...searchForm
        }
        
        const res = await __axios_api_bmgBinDing.getBinding(params);
        let result = res.data;
        if(result.code===2001){
            tableData.value = result.data.list;
            pageConfig.setTotalCount = result.data.total;
        }else{
            ElMessage.error(result.message)
        }
    }catch (e) {
        ElMessage.error('服务器错误')
    }finally {
        tableLoading.value = false;
    }
}


function onDeleteTableItem(id:string){
    ElMessageBox.confirm('确认删除当前关联关系绑定？','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
    }).then(()=>{
        __axios_api_bmgBinDing.bmgBinDing(id,'delete').then(res=>{
            if(res.data.code==2001){
                if(res.data.data===true){
                    ElMessage.success('删除成功');
                    getTableData();
                }else{
                    ElMessage.error('删除失败');
                }
            }
        })
    })
}

// 表格 👆


// dialog 👇

function onOpenDialog(){
    dialogConfig.dialogTitle = '新增'
    dialogConfig.visible = true;
    if(homologyTree.value.length===0) getHomogyList();
    if(manualMaintenance.value.length === 0) getMatterList();
}

function onCloseDialog(){
    dialogConfig.visible = false;
}

type ElTreeType = InstanceType<typeof ElTree>

const defaultProps = {
    children: 'children',
    label: 'dmName',
}


/**
 * 同源字段实例
 */
const homologyTreeRef = ref<ElTreeType>()

/**
 * 手动维护字段实例
 */
const manualMaintenanceRef = ref<ElTreeType>()


/**
 * 同源字段单选
 * @param e 
 */
const onHomologyTreeCheck:ElTreeType['onCheck'] = (e)=>{
    homologyTreeRef.value?.setCheckedKeys([e.dmId])
}

/**
 * 获取同源字段列表
 */
async function getHomogyList(){
    let res = await __axios_api_taskCount.homologyList();
    if(res.data.code===2001){
        homologyTree.value = res.data.data.list;
    }
}


/**
 * 获取手动维护字段列表
 */
async function getMatterList(){
    let res = await  __axios_api_taskCount.matterList();
    if(res.data.code===2001){
        manualMaintenance.value = res.data.data.list
    }
}

/**
 * 同源字段
 */
const homologyTree = ref<TaskCount.HomologyListResponse['list']>([])

/**
 * 手动维护字段
 */
const manualMaintenance = ref<TaskCount.HomologyListResponse['list']>([]);

let editId:string|null = null;

/**
 * 编辑
 * @param id 
 * @param syncDmId 
 * @param matterDmId 
 */
async function getDialogTreeData(id:string,syncDmId:string,matterDmId:string){
    dialogConfig.dialogTitle = '编辑'
    dialogConfig.visible = true;
    editId = id;
    await getHomogyList();
    await getMatterList();
    homologyTreeRef.value?.setCheckedKeys([syncDmId]);
    manualMaintenanceRef.value?.setCheckedKeys(matterDmId.split(','))
}

const saveLoading = ref(false);

/**
 * 保存关联字段
 */
async function saveDialogInfo(){
    saveLoading.value = true;
    let selectedHomologyKey = homologyTreeRef.value?.getCheckedNodes();
    let selectedManualMaintenanceKeys = manualMaintenanceRef.value?.getCheckedNodes();

    let matterDmId:string[] = [];
    let matterDmName:string[] = []
    selectedManualMaintenanceKeys?.forEach(item=>{
        matterDmId.push(item.dmId)
        matterDmName.push(item.dmName)
    })
    if(selectedHomologyKey!.length===0){
        ElMessage.warning('请选择同源字段')
    }
    if(selectedManualMaintenanceKeys!.length===0){
        ElMessage.warning('请选择手动维护字段')
    }
    try {

        let res;
        if(editId){
            res = await __axios_api_bmgBinDing.bmgBinDing({
                id:editId,
                syncDmId:selectedHomologyKey![0].dmId,
                matterDmId:matterDmId,
                syncDmName:selectedHomologyKey![0].dmName,
                matterDmName,
            },'put')
            
        }else{
            res = await __axios_api_bmgBinDing.bmgBinDing({
                syncDmId:selectedHomologyKey![0].dmId,
                matterDmId:matterDmId,
                syncDmName:selectedHomologyKey![0].dmName,
                matterDmName
            },'post')
        }

        if(res.data.code===2001){
            dialogConfig.visible=false;
            let msg = editId?'关联绑定编辑成功':'新增关联绑定成功'
            ElMessage.success(msg);
            await getTableData();
        }
    } catch (error) {
        
    } finally {
        saveLoading.value = false;
    }
}


function onDialogClose (){
    editId = null;
    homologyTreeRef.value?.setCheckedKeys([]);
    manualMaintenanceRef.value?.setCheckedKeys([]);
}

// dialog 👆

</script>

<template>
    <ListPageLayout :breadcrumb-item="['事项管理','关联绑定']">
        <template #searchCard>
            <div class="search_card">
                <div class="search_operations">
                    <span class="span_pr16">
                        <el-input placeholder="请输入字段名称" v-model="searchForm.syncDmName" clearable />
                    </span>
                    <span class="span_pr16">
                        <el-input placeholder="请输入关联字段" v-model="searchForm.matterDmName" clearable />
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
                <el-table :key="tableKey" :data="tableData" border height="100%" v-loading="tableLoading">
                    <el-table-column type="index" label="序号" width="55" align="center" :index="(index:number)=>useTableIndex(index,pageConfig.getCurrentPage, pageConfig.getPageSize)" />
                    <el-table-column align="center" prop="syncDmName" label="字段名称" />
                    <el-table-column align="center" prop="matterDmName" label="关联维护字段" />
                    <el-table-column align="center" prop="updateTime" label="创建时间" />
                    <el-table-column align="center" fixed="right" label="操作" width="180">
                        <template #default="s">
                            <el-config-provider :button="{ autoInsertSpace:false}">
                                <el-button type="primary" :text="true" @click="getDialogTreeData(s.row.id, s.row.syncDmId, s.row.matterDmId)">修改</el-button>
                                <el-button type="danger" :text="true" @click="onDeleteTableItem(s.row.id)">删除</el-button>
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
                    @current-change="(p:number)=>{pageConfig.onCurrentPageChange(p,getTableData)}" @size-change="(p:number)=>{pageConfig.onPageSizeChange(p, getTableData)}" />
            </div>
        </template>
    </ListPageLayout>

    <!-- 关联绑定弹窗 -->
    <el-dialog top="5vh" v-model="dialogConfig.visible" :close-on-press-escape="dialogConfig.closeOnPressEscpe" :close-on-click-modal="dialogConfig.closeOnClickModal" :draggable="dialogConfig.draggable" width="716px" @closed="onDialogClose">
        <template #header>
            <div class="dialog-title--global">
                {{ dialogConfig.dialogTitle }}
            </div>
        </template>
        <div class="dialog-content">
            <div class="dialog-content-left cc">
                <div class="cc-title">同源字段</div>
                <div class="tree-content">
                    <el-tree :props="defaultProps" node-key="dmId" ref="homologyTreeRef" show-checkbox :data="homologyTree" :check-on-click-node="true" @check="onHomologyTreeCheck"></el-tree>
                </div>
            </div>
            <div class="dialog-content-right cc">
                <div class="cc-title">手动维护字段</div>
                <div class="tree-content">
                    <el-tree ref="manualMaintenanceRef" show-checkbox :data="manualMaintenance" :props="defaultProps"  node-key="dmId" :check-on-click-node="true"></el-tree>
                </div>
            </div>
        </div>
        <template #footer>
            <el-button @click="onCloseDialog">取消</el-button>
            <el-button type="primary" :loading="saveLoading" @click="saveDialogInfo">保存</el-button>
        </template>
    </el-dialog>

</template>

<style scoped lang="less">
.dialog-content{
  display: flex;
  .cc{
    width: 320px;
    border: 1px solid #F1F1F1;
    border-radius: 2px;
    .tree-content{
      height: 450px;
      overflow: auto;
    }
    .cc-title{
      height: 48px;
      background-color: #F1F1F1;
      padding-left: 22px;
      line-height: 48px;
      font-weight: 500;
      font-size: 16px;
    }
    & + .cc{
      margin-left: 20px;
    }
  }
}
</style>