<!--
 * @Author: jiaxiaorong jiaxiaorong@syngo.net
 * @Date: 2023-10-25 17:37:23
 * @LastEditors: jiaxiaorong jiaxiaorong@syngo.net
 * @LastEditTime: 2023-10-25 17:43:37
 * @FilePath: \syngo-yckt-matter-library-web\src\views\MatterDetails\components\IsogenyMatter.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup lang="ts">
import { ref } from 'vue';
import ParagraphCom from "./ParagraphCom.vue"
import { downloadFileByDocId } from "@/axios/api/taskCount";
import { ElMessage } from "element-plus";
interface Props {
    syncMaterial: SyncMaterialObj[]
}
const props = defineProps<Props>()
interface SpanMethodProps {
    row: SyncMaterialObj

    columnIndex: number
}
//判断是否是材料合并单元格 gType=1表示材料
function arraySpanMethod({ row, columnIndex }: SpanMethodProps) {
    if (row.gType == '0') {
        if (columnIndex === 0) {
            return [1, 10]
        } else if (columnIndex !== 0) {
            return [0, 0]
        }
    }
}
//材料来源弹框
const dialogVisible = ref(false)

const handleClose = (done: () => void) => {
    dialogVisible.value = false
}
//来源说明内容
const certOfficeVal = ref<string>()

//来源说明点击
const sourceClick = (val: string)=> {
    certOfficeVal.value = val;
    dialogVisible.value = true
}
//下载表格地址
let downloadUrl = ref<string>("")

</script>

<template>
    <el-table :data="syncMaterial" border :span-method="arraySpanMethod">
        <el-table-column label="序号" width="80">
            <template #default="scope">
                <span v-if="scope.row.gType == '1'">{{ scope.row.mIndex }}</span>
                <span v-else>{{ scope.row.mIndex }}、{{ scope.row.gName }}</span>
            </template>
        </el-table-column>
        <el-table-column>
            <template #header>
                <span><i style="color: #409EFF">*</i>材料名称</span>
            </template>
            <template #default="scope">
                <span v-if="scope.row.gType == '1'">{{ scope.row.gName }}</span>
            </template>
        </el-table-column>
        <el-table-column>
            <template #header>
                <span><i style="color: #409EFF">*</i>材料来源</span>
            </template>
            <template #default="scope">
                <span>{{ scope.row.mSource }}</span>
                <el-button type="primary" link @click="sourceClick(scope.row.certOffice)" v-if="scope.row.certOffice">来源说明></el-button>
            </template>
        </el-table-column>
        <el-table-column prop="isneed">
            <template #header>
                <span><i style="color: #409EFF">*</i>材料必要性</span>
            </template>
        </el-table-column>
        <el-table-column prop="otherNum">
            <template #header>
                <span><i style="color: #409EFF">*</i>数量要求</span>
            </template>
            <template #default="scope">
                <span v-if="scope.row.isReserved == '1' && scope.row.originalNum">正本原件{{ scope.row.originalNum }}份;</span>
                <span v-if="scope.row.isDuplicate == '1' && scope.row.originalNum">副本原件{{ scope.row.originalNum }}份</span>
                <span v-if="scope.row.isReserved != '1' && scope.row.isOriginal == '1'">原件{{ scope.row.originalNum
                }}份</span>
                <span v-if="scope.row.isCopy == '1'">复印件{{ scope.row.copyNum }}份</span>
                <span v-if="scope.row.isDuplicateCopy == '1'">复印件{{ scope.row.duplicateCopyNum }}份</span>
            </template>
        </el-table-column>
        <el-table-column prop="mMedia">
            <template #header>
                <span><i style="color: #409EFF">*</i>介质要求</span>
            </template>
            <template #default="scope">
                <span v-if="scope.row.mMedia">{{ scope.row.mType }}: {{ scope.row.mMedia }}</span>
            </template>
        </el-table-column>
        <el-table-column>
            <template #header>
                <span><i style="color: #409EFF">*</i>表格及样例下载</span>
            </template>
            <template #default="scope">
                <span v-if="scope.row.mType == '结果文书类' || (scope.row.mType == '文本类' && !scope.row.att3Id)">不涉及</span>
                <div v-if="scope.row.mType == '表格类'" class="table_a">
                    <span class="link_a" @click="downloadFileByDocId(scope.row.att2Id)">空表下载</span>
                    <span class="link_a" @click="downloadFileByDocId(scope.row.att1Id)">样表下载</span>
                </div>
                <span v-if="scope.row.mType == '文本类' && scope.row.att3Id" class="link_a" @click="downloadFileByDocId(scope.row.att3Id)">范本下载</span>
            </template>
        </el-table-column>
        <el-table-column>
            <template #header>
                <span><i style="color: #409EFF">*</i>受理标准</span>
            </template>
            <template #default="scope">
                <ParagraphCom :text="scope.row.auditPoint"></ParagraphCom>
            </template>
        </el-table-column>
        <el-table-column>
            <template #header>
                <span><i style="color: #409EFF">*</i>提供材料依据</span>
            </template>
            <template #default="scope">
                <ParagraphCom :text="scope.row.materialsevidence"></ParagraphCom>
            </template>
        </el-table-column>
        <el-table-column>
            <template #header>
                <span><i style="color: #409EFF">*</i>其他要求</span>
            </template>
            <template #default="scope">
                <ParagraphCom :text="scope.row.requirement"></ParagraphCom>
            </template>
        </el-table-column>
    </el-table>
    <el-dialog v-model="dialogVisible" width="30%" :before-close="handleClose">
        <template #header>
            <div class="dialog-title--global">
                来源说明
            </div>
        </template>
        <span>{{certOfficeVal}}</span>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<style lang="less" scoped>
.table_a {
    span:first-child {
        margin-bottom: 4px;
    }

    span {
        display: block;
    }
}

.link_a {
    width: 70px;
    text-align: center;
    display: block;
    padding: 3px;
    border: 1px solid #2E73FE;
    color: #2E73FE;
    text-decoration: none;
    cursor: pointer;
}
</style>