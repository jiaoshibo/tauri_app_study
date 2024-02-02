<!--
 * @Author: jiaxiaorong jiaxiaorong@syngo.net
 * @Date: 2023-10-24 14:38:36
 * @LastEditors: jiaxiaorong jiaxiaorong@syngo.net
 * @LastEditTime: 2023-10-24 16:10:13
 * @FilePath: \syngo-yckt-matter-library-web\src\views\MatterDetails\components\KnowledgeCom.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup lang="ts">
import { ref, reactive } from 'vue';
import * as matterInfo from "@/axios/api/matterInfo";
import { ElMessage, ElMessageBox } from "element-plus";

import { useRoute } from 'vue-router';
import {
    Plus
} from '@element-plus/icons-vue'
const route = useRoute();
interface Props {
    caseData: CaseObj[],
    idParams: {
        matterId: string,
        situationId: string,
    }
}
const props = defineProps<Props>()

//保存状态 新建/编辑
let status = ref<number>(1)
//弹框标题
const caseDialogTitle = ref<string>("添加案例库")
//弹框显示隐藏
const caseDialogVisible = ref<boolean>(false)

//知识库问答对Form表单
const matterCasesform = ref<caseParams>({
    id: "",
    aseTitle: "",
    caseAnswers: "",
    knowledgePointsPublicity: "",
    situationId: props.idParams.situationId,
})

//编辑
const editCaseTableRow = (row: any) => {
    caseDialogTitle.value = "编辑案例库";
    matterCasesform.value.id = row.id;
    matterCasesform.value.aseTitle = row.aseTitle;
    matterCasesform.value.caseAnswers = row.caseAnswers;
    matterCasesform.value.knowledgePointsPublicity = row.knowledgePointsPublicity;
    matterCasesform.value.situationId = row.situationId;
    status.value = 2;
    caseDialogVisible.value = true;
}
//保存
const addCase = ($parent: any) => {
    if (status.value === 1) {
        onBmgSpecialCasesQa($parent)
    } else {
        onEditBmgSpecialCasesQa($parent)
    }
}

//关闭弹框
const caseHandleClose = () => {
    caseDialogVisible.value = false;
}
//打开弹框
const openDilogClick = () => {
    caseDialogTitle.value = "添加案例库";
    matterCasesform.value.id = "";
    matterCasesform.value.aseTitle = "";
    matterCasesform.value.caseAnswers = "";
    matterCasesform.value.knowledgePointsPublicity = "";
    matterCasesform.value.situationId = props.idParams.situationId
    caseDialogVisible.value = true;
    status.value = 1
}

//  新增知识库问答
function onBmgSpecialCasesQa($parent: any) {
    let data = { ...matterCasesform.value }
    matterInfo.BmgSpecialCasesQa(data).then(res => {
        let resData = res.data;
        if (resData.code === 2001) {
            ElMessage.success("保存成功！")
            $parent.taskBasicInfo()
            caseDialogVisible.value = false;
        } else {
            ElMessage.error(resData.message)
        }
    }).catch(() => {
        ElMessage.error('服务器错误')
    }).finally(() => {
        // tableLoading.value = false;
    })
}
//  编辑知识库问答
function onEditBmgSpecialCasesQa($parent: any) {
    let data = { ...matterCasesform.value }
    matterInfo.editBmgSpecialCasesQa(data).then(res => {
        let resData = res.data;
        if (resData.code === 2001) {
            ElMessage.success("保存成功！")
            $parent.taskBasicInfo()
            caseDialogVisible.value = false;
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
function onDeleteKnodewList(id: string, $parent: any) {
    ElMessageBox.confirm('确认删除当前项？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        matterInfo.deleteBmgSpecialCasesQa({ id }).then(res => {
            if (res.data.code == 2001) {
                if (res.data.data === true) {
                    ElMessage.success('删除成功');
                    $parent.taskBasicInfo()
                } else {
                    ElMessage.error('删除失败');
                }
            }
        })
    })
}
</script>

<template>
    <el-table :data="caseData" border>
        <el-table-column prop="aseTitle" label="案例题干">
        </el-table-column>
        <el-table-column prop="caseAnswers" label="案例答案">
        </el-table-column>
        <el-table-column label="案例公开性">
            <template #default="scope">
                <span v-if="scope.row.knowledgePointsPublicity == '0'">不公开</span>
                <span v-if="scope.row.knowledgePointsPublicity == '1'">公开</span>
            </template>
        </el-table-column>
        <el-table-column label="操作">
            <template #default="scope">
                <el-button type="text" @click="editCaseTableRow(scope.row)">编辑</el-button>
                <el-button type="text" @click="onDeleteKnodewList(scope.row.id, $parent)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="add_table_colum" @click="openDilogClick">
        <el-icon :size="16" color="#165DFF">
            <Plus />
        </el-icon>
        <span>添加案例库</span>
    </div>
    <!-- 案例库弹框 -->
    <el-dialog v-model="caseDialogVisible" width="60%" :before-close="caseHandleClose">
        <template #header>
            <div class="dialog-title--global">
                {{ caseDialogTitle }}
            </div>
        </template>
        <div class="fill_card_forms">
            <el-form :model="matterCasesform" ref="matterCases" label-width="100px" class="demo-ruleForm">
                <el-form-item label="案例题干:" class="form_w">
                    <el-input v-model="matterCasesform.aseTitle"></el-input>
                </el-form-item>
                <el-form-item label="案例答案:" class="form_w">
                    <el-input v-model="matterCasesform.caseAnswers"></el-input>
                </el-form-item>
                <el-form-item label="案例公开性:" class="form_w">
                    <el-select v-model="matterCasesform.knowledgePointsPublicity" placeholder="请选择">
                        <el-option label="公开" value="1"></el-option>
                        <el-option label="不公开" value="0"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="caseHandleClose">取 消</el-button>
                <el-button type="primary" @click="addCase($parent)">确 定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<style lang="less" scoped>
.add_table_colum {
    display: flex;
    align-items: center;
    width: 140px;
    height: 40px;
    background: #F2F3F8;
    border-radius: 2px;
    font-size: 14px;
    color: #165DFF;
    justify-content: center;
    line-height: 40px;
    margin-top: 10px;
    cursor: pointer;
}
</style>