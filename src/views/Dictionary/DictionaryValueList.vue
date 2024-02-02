<script lang="ts" setup>
import { ref,reactive, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { Plus } from '@element-plus/icons-vue'
import ListPageLayout from "@/components/ListPageLayout.vue";
import { PageConfig, useTableIndex } from '@/hooks/usePageConfig';
import { useDialogConfig } from '@/hooks/useDialogConfig';
import * as __axios_api_backBmgExtraConfigMatter from '@/axios/api/backBmgExtraConfigMatter';


onBeforeMount(()=>{
    getTableData();
})

const route = useRoute()

const dialogConfig = useDialogConfig();
const pageConfig = reactive(new PageConfig())

const tableLoading = ref(false)

const tableData = ref<any[]>([]);


function getTableData(){
    tableLoading.value = true;
    __axios_api_backBmgExtraConfigMatter.getOptionByName(route.params.name as string).then(res=>{
        if(res.data.code===2001){
            tableData.value = res.data.data
        }
    }).finally(()=>{
        tableLoading.value = false;
    })
}



function delItem(id:string){
    ElMessageBox.confirm('确认删除当前选项名称','提示',{
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

// ========= 弹窗 👇===========

interface DialogForm {
    id?: string;
    content: string;
}

const dialogForm = reactive<DialogForm>({
    content:''
});

const dialogFormRef = ref<FormInstance>();
const formRules = ref<FormRules>({
    content:{
        required:true,message:'请输入选项名称',trigger:'blur'
    }
})

function onOpenDialog(isEdit?:true,value?:DialogForm){
    dialogConfig.visible = true;
    if(isEdit){
        dialogForm.id = value?.id;
        dialogForm.content = value?.content as string
    }
}

function onCloseDialog(){
    dialogConfig.visible = false;
}

const saveLoading = ref(false)

async function save(){
    try {
        saveLoading.value = true;
        let flag = await dialogFormRef.value?.validate();
        if(flag){
            if (dialogForm.id) {
                const res = await __axios_api_backBmgExtraConfigMatter.putBackBmgExtraConfigMatter({
                    id: dialogForm.id as string,
                    content: dialogForm.content
                })
                if (res.data.code === 2001) {
                    ElMessage.success('编辑成功');
                }
            } else {
                const res = await __axios_api_backBmgExtraConfigMatter.addOption({
                    id: route.params.id as string,
                    content: dialogForm.content
                })
                if (res.data.code === 2001) {
                    ElMessage.success('新增成功');
                }
            }
            getTableData();
            dialogConfig.visible = false;
        }
    } catch (error) {
        
    } finally {
        saveLoading.value=false;
    }
}

function onDialogClosed(){
    dialogForm.content = '';
    dialogForm.id = undefined;
}

// ============= 弹窗 👆 ===============
</script>

<template>
    <ListPageLayout :breadcrumb-item="['事项管理', '字典配置','选项数据管理']">
        <template #searchCard>
            <div class="search_card">
                <span class="span_pr16">
                    <el-button :icon="Plus" type="primary" @click="onOpenDialog()">新增</el-button>
                </span>
            </div>
        </template>
        <template #tableContent>
            <div class="tableContent">
                <el-table :data="tableData" border height="100%" v-loading="tableLoading">
                    <el-table-column type="index" align="center" label="序号" width="55"
                        :index="(index:number) => useTableIndex(index, pageConfig.getCurrentPage, pageConfig.getPageSize)" />
                    <el-table-column align="center" prop="content" label="选项名称" />
                    <el-table-column align="center" prop="updateTime" width="200" label="更新时间" />
                    <el-table-column align="center" width="200" label="操作">
                        <template #default="s">
                            <el-config-provider :button="{autoInsertSpace:false}">
                                <el-button type="primary" :text="true" @click="onOpenDialog(true, { id: s.row.id, content: s.row.content })">编辑</el-button>
                                <el-button type="danger" :text="true" @click="delItem(s.row.id)">删除</el-button>
                            </el-config-provider>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </template>
    </ListPageLayout>

    <el-dialog v-model="dialogConfig.visible" :close-on-click-modal="dialogConfig.closeOnClickModal"
        :close-on-press-escape="dialogConfig.closeOnPressEscpe" :draggable="dialogConfig.draggable" @closed="onDialogClosed">
        <template #header>
            <div class="dialog-title--global">
                新增
            </div>
        </template>
        <div class="dialog-content">
            <el-form size="large" ref="dialogFormRef" :rules="formRules" :model="dialogForm">
                <el-form-item label="选项名称" prop="content">
                    <el-input placeholder="请输入" v-model="dialogForm.content"></el-input>
                </el-form-item>
            </el-form>
        </div>

        <template #footer>
            <el-button @click="onCloseDialog">取消</el-button>
            <el-button :loading="saveLoading" type="primary" @click="save">保存</el-button>
        </template>
    </el-dialog>
</template>



<style lang="less" scoped></style>