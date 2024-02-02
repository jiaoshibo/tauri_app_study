<script setup lang="ts">
import { ref, reactive, onBeforeMount, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import ListPageLayout from "@/components/ListPageLayout.vue";
import { PageConfig, useTableIndex } from '@/hooks/usePageConfig';
import * as __axios_api_taskCount from "@/axios/api/taskCount";
import { ElMessage, ElMessageBox } from "element-plus";
import { useDialogConfig } from '@/hooks/useDialogConfig'
import { Plus, Search, RefreshRight } from "@element-plus/icons-vue";
import * as __axios_api_backBmgExtraConfigMatter from '@/axios/api/backBmgExtraConfigMatter';
import type { FormInstance, FormRules  } from 'element-plus';

const router =  useRouter();

onBeforeMount(() => {
    getTableData();
})
const pageConfig = reactive<PageConfig>(new PageConfig())

// 表格 👇
const tableData = ref<any[]>([])
const tableLoading = ref(false);
const tableKey = ref<number>(1);

const searchForm = ref("")
function resetForm(){
    searchForm.value = '';
    getTableData();
}
function getTableData() {
    tableKey.value++;
    tableLoading.value = true;
    let params: TaskCount.SelectAllParentCatalogueSelectRequest = {
        pageNo: pageConfig.getCurrentPage,
        pageSize: pageConfig.getPageSize
    }
    if(searchForm.value){
        params.name = searchForm.value
    }
    __axios_api_taskCount.selectAllParentCatalogueSelect(params).then(res => {
        let result = res.data;
        if (result.code === 2001) {
            tableData.value = result.data.list;
            pageConfig.setTotalCount = result.data.total;
        } else {
            ElMessage.error(result.message)
        }
    }).catch(e => {
        ElMessage.error('服务器错误')
    }).finally(() => {
        tableLoading.value = false
    })
}


function getDicValue(id:string,name:string){
    router.push({name:'DictionaryValueList',params:{name,id}})
}



function delItem(id:string){
    ElMessageBox.confirm('确认删除当前选项目录名称','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
    }).then(()=>{
        __axios_api_backBmgExtraConfigMatter.delBackBmgExtraConfigMatter(id).then(res=>{
            if(res.data.code===2001){
                if(res.data.data===true){
                    getTableData();
                    ElMessage.success('删除成功')
                }else{
                    ElMessage.error('删除失败')
                }
            }else{
                ElMessage.error(res.data.message)
            }
        }).catch(()=>{
            ElMessage.error('服务器错误')
        })
    })
}

// 表格 👆



// dialog 👇
/**
 * 弹窗配置
 */
const dialogConfig = useDialogConfig();


interface DialogForm {
    id?:string,name:string,dmCode:string;
}

const dialogForm = reactive<DialogForm>({
    name: '', dmCode: ''
})


const DialogFormRef = ref<FormInstance>();

/** 选项目录编码校验正则 */
const dmNameRegExp = /^[A-Z]+$/;

const checkDmName = (_rule: any, value: any, callback: (error?: string | Error | undefined) => void) => {
    if (value) {
        if (!dmNameRegExp.test(value)) {
            callback(new Error('选项目录编码格式不正确，必须为大写英文字母'))
        } else {
            callback();
        }
    }
}



const formRules = ref<FormRules>({
    name:[
        {required:true,message:'请输入选项目录名称',trigger:'blur'}
    ],
    dmCode:[
        {required:true,message:'请输入选项目录编码',trigger:'blur'},
        {validator:checkDmName,trigger:'blur'}
    ]
})

/**
 * 打开弹窗
 * @param isEdit 是否编辑模式
 * @param value 
 */
function onOpenDialog(isEdit?:true,value?:DialogForm){
    dialogConfig.visible = true;
    if(isEdit){
        dialogConfig.dialogTitle = '编辑'
        dialogForm.id = value?.id;
        dialogForm.name = value?.name as string;
        dialogForm.dmCode = value?.dmCode as string;
    }else{
        dialogConfig.dialogTitle = '新增'
    }
}

/**
 * 弹窗关闭后的回调
 */
function onDialogClosed(){
    DialogFormRef.value?.clearValidate();
    nextTick(()=>{
        dialogForm.name = '';
        dialogForm.dmCode = '';
        dialogForm.id = undefined;   
    })
    
}

const dialogFormSaveLoading = ref(false);

/**
 * 保存选项目录名称
 */
async function onSaveDialogForm(){
    try {
        dialogFormSaveLoading.value = true;
        let flag = await DialogFormRef.value?.validate();
        if(flag){
            if(dialogForm.id){
                let res = await __axios_api_backBmgExtraConfigMatter.updName(dialogForm);
                if (res.data.code === 2001) {
                    ElMessage.success('修改成功');
                }else{
                    ElMessage.error('修改失败')
                }
            }else{
                let res = await __axios_api_backBmgExtraConfigMatter.postBackBmgExtraConfigMatter(dialogForm);
                if (res.data.code === 2001) {
                    ElMessage.success('新增成功');
                }else{
                    ElMessage.error('新增失败')
                }
            }
        }
    } catch (error) {
    } finally {
        dialogFormSaveLoading.value = false;
        getTableData();
    }
}
// dialog 👆

</script>

<template>
    <ListPageLayout :breadcrumb-item="['事项管理', '字典配置']">
        <template #searchCard>
            <div class="search_card">
                <div class="search_operations">
                    <span class="span_pr16">
                        <el-input placeholder="对象名称" v-model="searchForm" clearable />
                    </span>
                    <span class="span_pr16">
                        <el-button :icon="Search" type="primary" @click="getTableData">查询</el-button>
                        <el-button :icon="RefreshRight" @click="resetForm">重置</el-button>
                    </span>
                </div>
                <!-- <div class="table_operations">
                    <span class="span_pr16">
                        <el-button :icon="Plus" type="primary" @click="onOpenDialog()">新增</el-button>
                    </span>
                </div> -->
            </div>
        </template>
        <template #tableContent>
            <div class="tableContent">
                <el-table :key="tableKey" :data="tableData" border height="100%" v-loading="tableLoading">
                    <el-table-column type="index" align="center" label="序号" width="55"
                        :index="(index:number) => useTableIndex(index, pageConfig.getCurrentPage, pageConfig.getPageSize)" />
                    <el-table-column align="center" prop="name" label="选项目录名称" />
                    <el-table-column align="center" prop="dmCode" label="选项目录编码" />
                    <el-table-column align="center" prop="updateTime" label="更新时间" />
                    <el-table-column align="center" label="操作">
                        <template #default="s">
                            <el-config-provider :button="{autoInsertSpace:false}">
                                <el-button type="primary" :text="true" @click="onOpenDialog(true, s.row)">编辑</el-button>
                                <el-button type="primary" :text="true" @click="getDicValue(s.row.id, s.row.name)">选项数据管理</el-button>
                                <!-- <el-button type="danger" :text="true" @click="delItem(s.row.id)">删除</el-button> -->
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
                    @current-change="(c:number) => { pageConfig.onCurrentPageChange(c, getTableData) }"
                    @size-change="(p:number) => { pageConfig.onPageSizeChange(p, getTableData) }" />
            </div>
        </template>
    </ListPageLayout>
    <el-dialog v-model="dialogConfig.visible" width="45%" :close-on-click-modal="dialogConfig.closeOnClickModal"
        :close-on-press-escape="dialogConfig.closeOnPressEscpe" :draggable="dialogConfig.draggable" @closed="onDialogClosed">
        <template #header>
            <div class="dialog-title--global">
                {{ dialogConfig.dialogTitle }}
            </div>
        </template>
        <div class="dialog-content">
            <el-form size="large" :model="dialogForm" ref="DialogFormRef" :rules="formRules">
                <el-form-item label="选项目录名称" prop="name">
                    <el-input placeholder="请输入" v-model="dialogForm.name"></el-input>
                </el-form-item>
                <el-form-item label="选项目录编码" prop="dmCode">
                    <span v-if="dialogForm.id">{{ dialogForm.dmCode }}</span>
                    <el-input v-else placeholder="请输入选项目录编码，格式必须为大写英文字母" v-model="dialogForm.dmCode"></el-input>
                </el-form-item>
            </el-form>
        </div>

        <template #footer>
            <el-button @click="()=>{ dialogConfig.visible = false }">取消</el-button>
            <el-button type="primary" :loading="dialogFormSaveLoading" @click="onSaveDialogForm">保存</el-button>
        </template>
    </el-dialog>
</template>

<style scoped lang="less">
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