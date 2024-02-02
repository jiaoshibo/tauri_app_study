<script setup lang="ts">
import { ref, onBeforeMount, provide } from 'vue';
import type { TabPaneName } from 'element-plus'
import ArchorList from '@/components/ArchorList.vue'
import ConditionDialog from './components/ConditionDialog.vue'
import eventMaterialsCom from './components/eventMaterialsCom.vue'
import * as matterInfo from "@/axios/api/matterInfo";
import { ElMessage, ElMessageBox } from "element-plus";
import { deleteSituation } from "@/axios/api/taskCount";
import { useRoute } from 'vue-router';
const route = useRoute();

import {
    Plus
} from '@element-plus/icons-vue'
//左侧边栏数据
const archorData = ref<{ id: string; name: string }[]>([
    //     {
    //     id: "id1",
    //     name: "事项类型"
    // }, 
    {
        id: "id1",
        name: "情形配置"
    }])


const tableData = ref<SituationObj[]>([])
//tab展示
const activeName = ref('second')
//tab点击
const handleClick = (name: TabPaneName) => {
    if(eventMaterialsComRef.value) eventMaterialsComRef.value.clearDiversionPositionFormValidator();
    if (name == "first") {
        eventMaterialsComRef.value?.openDialogType(2, idParams.value.matterId, "", idParams.value.situationId);
        archorData.value = [{
            id: "id1",
            name: "申请材料"
        }, {
            id: "id2",
            name: "受理标准"
        }]
    } else {
        archorData.value = [{
            id: "id1",
            name: "情形配置"
        }]
    }
}

//编辑/新建
const conditionDilog = (type: number, matterId: string = "", situationName: string = "", id: string = "") => {
    ConditionDialogRef.value?.openDialog(type, matterId, situationName, id);
}

//弹框ref
const ConditionDialogRef = ref<InstanceType<typeof ConditionDialog> | null>(null);
const eventMaterialsComRef = ref<InstanceType<typeof eventMaterialsCom>>();
//获取情形id 事项id
const idParams = ref<{ matterId: string, situationId: string, situationName: string }>({
    matterId: "",
    situationId: "",
    situationName: ""
})
provide('idParams', idParams.value);
//获取情形
function taskBasicInfo() {
    matterInfo.taskBasicInfo(route.query.id as string).then(res => {
        let resData = res.data;
        if (resData.code === 2001) {
            tableData.value = resData.data?.[0].situation;
            idParams.value.matterId = resData?.data?.[0]?.basic.matterId;
            idParams.value.situationId = resData?.data?.[0]?.basic.situationId;
            idParams.value.situationName = resData?.data?.[0]?.basic.matterSituation;
        } else {
            ElMessage.error(resData.message)
        }
    }).catch(() => {
        ElMessage.error('服务器错误')
    }).finally(() => {
        // tableLoading.value = false;
    })
}
//删除
function onDeleteSituation(matterId: string, situationId: string) {
    ElMessageBox.confirm('确认删除当前项？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        let params = {
            matterId,
            situationId
        }
        deleteSituation(params).then(res => {
            if (res.data.code == 2001) {
                if (res.data.data === true) {
                    ElMessage.success('删除成功');
                    taskBasicInfo()
                } else {
                    ElMessage.error('删除失败');
                }
            }
        })
    })
}

//保存情形信息
const materialsSubmit = async () =>{
    let res = await eventMaterialsComRef.value?.onSubmitSituation();
    if(res){
        setTimeout(()=> {
            eventMaterialsComRef.value?.openDialogType(2, idParams.value.matterId, idParams.value.situationName, idParams.value.situationId);
        },1000)    
    }
}
onBeforeMount(() => {
    taskBasicInfo()
})
defineExpose({ taskBasicInfo })
</script>

<template>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-change="handleClick">
        <el-tab-pane label="事项材料信息（默认无事项情形）" name="first">
            <div class="detail_formlist">
                <div class="detail_formlist_left">
                    <ArchorList class="archor-list" :archorData="archorData"></ArchorList>
                </div>
                <div class="detail_formlist_right">
                    <eventMaterialsCom :isShow="false" ref="eventMaterialsComRef"></eventMaterialsCom>
                    <div class="materials_button">
                        <el-button type="primary" @click="materialsSubmit">保存</el-button>
                    </div>
                </div>
            </div>
        </el-tab-pane>
        <el-tab-pane label="事项情形" name="second">
            <div class="detail_formlist">
                <div class="detail_formlist_left">
                    <ArchorList class="archor-list" :archorData="archorData"></ArchorList>
                </div>
                <div class="detail_formlist_right">
                    <div id="id1">
                        <div class="formlist_title">
                            <div class="flt_left">
                                <span></span>
                                <h5>情形配置</h5>
                            </div>
                            <div class="flt_right">
                                <el-button type="primary" :icon="Plus" @click="conditionDilog(1)">添加情形</el-button>
                            </div>
                        </div>
                        <el-table :data="tableData" border>
                            <el-table-column prop="matterSituation" label="情形名称">
                            </el-table-column>
                            <el-table-column label="操作" width="200px">
                                <template #default="scope">
                                    <el-button type="text"
                                        @click="conditionDilog(2, scope.row.matterId, scope.row.matterSituation, scope.row.situationId)">编辑</el-button>
                                    <el-button type="danger" link
                                        @click="onDeleteSituation(scope.row.matterId, scope.row.situationId)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
        </el-tab-pane>
    </el-tabs>
    <!-- 情形详情弹框 -->
    <ConditionDialog ref="ConditionDialogRef"></ConditionDialog>
</template>

<style lang="less" scoped>
.detail_formlist {
    display: flex;
    margin-top: 36px;

    .detail_formlist_left {
        width: 190px;
        flex-shrink: 0;
        position: relative;

        .archor-list {
            position: sticky;
            top: 20px;
        }
    }

    .detail_formlist_right {
        flex: 1;
        height: calc(100vh - 360px);
        overflow: auto;

        .form_item_flex {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }
    }
}

.form_item_flex {
    display: flex;
}
.materials_button {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
}
</style>