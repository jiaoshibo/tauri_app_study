<!--
 * @Author: jiaxiaorong jiaxiaorong@syngo.net
 * @Date: 2023-10-24 14:38:36
 * @LastEditors: jiaxiaorong jiaxiaorong@syngo.net
 * @LastEditTime: 2023-10-24 15:54:14
 * @FilePath: \syngo-yckt-matter-library-web\src\views\MatterDetails\components\KnowledgeCom.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup lang="ts">
import { ref, onBeforeMount, reactive } from 'vue';
import * as matterInfo from "@/axios/api/matterInfo";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRoute, useRouter } from 'vue-router';
import {
    Plus
} from '@element-plus/icons-vue'

const route = useRoute();
interface Props {
    knowledgeData: KnowledgeObj[],
    idParams: {
        matterId: string,
        situationId: string,
    }
}
const props = defineProps<Props>()


//弹框标题
const knowledgeDialogTitle = ref<string>("添加知识库问答")
//弹框显示隐藏
const knowledgeDialogVisible = ref<boolean>(false)

//知识库问答对Form表单
const matterRepositoriesform = ref<knowledgePointsParams>({
    id: "",
    knowledgePoints: "",
    answersKnowledgePoints: "",
    similitudeMethod: "",
    relatedIssues: "",
    effectiveDate: "",
    expiryDate: "",
    knowledgePointsPublicity: "",
    situationId: props.idParams.situationId,
})

//相似问法
let answerForm = ref<string[]>([""])
//添加相似问法
const addFormList = () => {
    answerForm.value.push("")
}
//删除相似问法
const deleteForm = (index: number) => {
    answerForm.value.splice(index, 1)
}
//新建/编辑
const editKnowledgeTableRow = (row: any) => {
    knowledgeDialogTitle.value = "编辑知识库问答"
    delete row.createdBy;
    delete row.updatedBy;
    delete row.createdTime;
    delete row.updateTime;
    delete row.updatedTime;
    delete row.isDelete;
    matterRepositoriesform.value = { ...row };
    let similitudeMethodData = matterRepositoriesform.value.similitudeMethod?.split(',')
    answerForm.value = similitudeMethodData ?? [""];

    status.value = 2;
    knowledgeDialogVisible.value = true;
}
//保存
const addKnowledge = ($parent: any) => {
    if (status.value === 1) {
        onBackBmgCommonQa($parent)
    } else {
        onEditKnodewList($parent)
    }
}
//关闭弹框
const knowledgeHandleClose = () => {
    knowledgeDialogVisible.value = false;
}
//打开弹框
const openDilogClick = () => {
    knowledgeDialogTitle.value = "添加知识库问答"
    matterRepositoriesform.value.id = "";
    matterRepositoriesform.value.knowledgePoints = "";
    matterRepositoriesform.value.answersKnowledgePoints = "";
    matterRepositoriesform.value.similitudeMethod = "";
    matterRepositoriesform.value.relatedIssues = "";
    matterRepositoriesform.value.effectiveDate = "";
    matterRepositoriesform.value.expiryDate = "";
    matterRepositoriesform.value.knowledgePointsPublicity = "";
    matterRepositoriesform.value.situationId = props.idParams.situationId
    status.value = 1;
    knowledgeDialogVisible.value = true;
}

//  新增知识库问答
function onBackBmgCommonQa($parent: any) {
    if (answerForm.value.length > 0) {
        matterRepositoriesform.value.similitudeMethod = answerForm.value.join(",")
    }
    let data = { ...matterRepositoriesform.value }
    matterInfo.backBmgCommonQa(data).then(res => {
        let resData = res.data;
        if (resData.code === 2001) {
            ElMessage.success("保存成功！")
            $parent.taskBasicInfo()
            knowledgeDialogVisible.value = false;
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
function onEditKnodewList($parent: any) {
    if (answerForm.value.length > 0) {
        matterRepositoriesform.value.similitudeMethod = answerForm.value.join(",")
    }
    let data = { ...matterRepositoriesform.value }
    matterInfo.editKnodewList(data).then(res => {
        let resData = res.data;
        if (resData.code === 2001) {
            ElMessage.success("保存成功！")
            $parent.taskBasicInfo()
            knowledgeDialogVisible.value = false;
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
        matterInfo.deleteKnodewList({ id }).then(res => {
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
//保存状态 新建/编辑
let status = ref<number>(1)
</script>

<template>
    <el-table :data="knowledgeData" border>
        <el-table-column prop="knowledgePoints" label="知识点题干">
        </el-table-column>
        <el-table-column prop="answersKnowledgePoints" label="知识点答案">
        </el-table-column>
        <el-table-column prop="similitudeMethod" label="相似问法">
        </el-table-column>
        <el-table-column prop="relatedIssues" label="关联问题">
        </el-table-column>
        <el-table-column prop="effectiveDate" label="生效日期">
        </el-table-column>
        <el-table-column prop="expiryDate" label="失效日期">
        </el-table-column>
        <el-table-column label="知识点公开性">
            <template #default="scope">
                <span v-if="scope.row.knowledgePointsPublicity == '0'">不公开</span>
                <span v-if="scope.row.knowledgePointsPublicity == '1'">公开</span>
            </template>
        </el-table-column>
        <el-table-column label="操作">
            <template #default="scope">
                <el-button type="text" @click="editKnowledgeTableRow(scope.row)">编辑</el-button>
                <el-button type="text" @click="onDeleteKnodewList(scope.row.id, $parent)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="add_table_colum" @click="openDilogClick">
        <el-icon :size="16" color="#165DFF">
            <Plus />
        </el-icon>
        <span>添加知识库问答</span>
    </div>
    <!-- 知识库弹框 -->
    <!-- 知识库 -->
    <el-dialog v-model="knowledgeDialogVisible" width="60%" :before-close="knowledgeHandleClose">
        <template #header>
            <div class="dialog-title--global">
                {{ knowledgeDialogTitle }}
            </div>
        </template>
        <div class="fill_card_forms">
            <el-form :model="matterRepositoriesform" ref="matterRepositories" label-width="100px" class="demo-ruleForm">
                <el-form-item label="知识点题干:" class="form_w">
                    <el-input v-model="matterRepositoriesform.knowledgePoints"></el-input>
                </el-form-item>
                <el-form-item label="知识点答案:" class="form_w">
                    <el-input v-model="matterRepositoriesform.answersKnowledgePoints"></el-input>
                </el-form-item>
                <el-form-item label="相似问法:" class="form_w">
                    <div class="knowledge_lists">
                        <div class="matters__from_lists" v-for="(item, index) in answerForm" :key="index">
                            <el-input v-model="answerForm[index]"></el-input>
                            <div class="form_list_btn">
                                <el-button @click="addFormList">+</el-button>
                                <el-button @click="deleteForm(index)">-</el-button>
                            </div>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="关联问题:" class="form_w">
                    <el-input type="textarea" :rows="2" placeholder="关联问题"
                        v-model="matterRepositoriesform.relatedIssues"></el-input>
                </el-form-item>
                <div class="knowledge_dialog_form">
                    <el-form-item label="生效日期:">
                        <el-date-picker v-model="matterRepositoriesform.effectiveDate" format="YYYY-MM-DD"
                            value-format="YYYY-MM-DD" type="date" placeholder="创建时间"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="失效日期:">
                        <el-date-picker v-model="matterRepositoriesform.expiryDate" format="YYYY-MM-DD"
                            value-format="YYYY-MM-DD" type="date" placeholder="创建时间"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="知识点公开性:">
                        <el-select v-model="matterRepositoriesform.knowledgePointsPublicity" placeholder="请选择">
                            <el-option label="公开" value="1"></el-option>
                            <el-option label="不公开" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="knowledgeHandleClose">取 消</el-button>
                <el-button type="primary" @click="addKnowledge($parent)">确 定</el-button>
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

.knowledge_lists {

    display: flex;
    flex-wrap: wrap;

    .matters__from_lists {
        display: flex;
        flex-wrap: nowrap;

        .el-input {
            width: 50%;
        }
    }

    .form_list_btn {
        margin-left: 16px;
    }
}

.knowledge_dialog_form {
    display: flex;
}

:deep(.knowledge_dialog_form .el-form-item) {
    width: 32%;
}
</style>