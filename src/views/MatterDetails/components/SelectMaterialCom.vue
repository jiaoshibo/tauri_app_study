<!--
 * @Author: jiaxiaorong jiaxiaorong@syngo.net
 * @Date: 2023-10-24 17:23:23
 * @LastEditors: jiaxiaorong jiaxiaorong@syngo.net
 * @LastEditTime: 2023-10-26 11:32:32
 * @FilePath: \syngo-yckt-matter-library-web\src\views\MatterDetails\components\ConditionDialog.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup lang="ts">
import { ref } from 'vue'

import { ElMessage, ElMessageBox } from "element-plus";
import { useRoute } from 'vue-router';
import { selectMaterialByMatterId, downloadFileByDocId } from "@/axios/api/taskCount";


//弹框ref
const dialogVisible = ref<boolean>(false)


const route = useRoute();
const handleClose = () => {
    dialogVisible.value = false;
}
const openDialog = () => {
    onSelectMaterialByMatterId()
    dialogVisible.value = true;
}
//材料名称输入
const materialName = ref<string>()

//材料名称列表
const matterMaterial = ref<TaskCount.SelectMaterialByMatterObj[]>([])

//获取事项详情-添加情形-查询重点案例
function onSelectMaterialByMatterId() {
    selectMaterialByMatterId(route.query.matterId as string).then(res => {
        let resData = res.data;
        if (resData.code === 2001) {
            matterMaterial.value = resData.data;

        } else {
            ElMessage.error(resData.message)
        }
    }).catch(() => {
        ElMessage.error('服务器错误')
    }).finally(() => {
        // tableLoading.value = false;
    })
}

// 子组件默认包含是私有
defineExpose({
    openDialog,
    handleClose
})
const multipleSelection = ref([])
//选择材料
const handleSelectionChange = (val: any) => {
    multipleSelection.value = val
}
const emit = defineEmits(['materClick'])
//确认选择
const materClick = () => {
    emit('materClick', multipleSelection.value)
    handleClose()
}

//设置材料是否可选择

function checkboxSelect(row: TaskCount.SelectMaterialByMatterObj) {
    if (row.gtype == '1') {
        return true
    } else {
        return false
    }
}
interface SpanMethodProps {
    row: TaskCount.SelectMaterialByMatterObj
    columnIndex: number
}
//判断是否是材料合并单元格 gType=1表示材料
function arraySpanMethod({ row, columnIndex }: SpanMethodProps) {
    if (row.gtype == '0') {
        if (columnIndex === 1) {
            return [1, 3]
        } else if (columnIndex !== 1) {
            return [0, 0]
        }
    }
}


function fileDownloadHandler(materialId?:string){
    if(materialId){
        downloadFileByDocId(materialId)
    }else{
        ElMessage.warning('暂无文件下载地址')
    }
}

</script>

<template>
    <el-dialog v-model="dialogVisible" width="80%" :before-close="handleClose">
        <template #header>
            <div class="dialog-title--global">
                选择材料
            </div>
        </template>
        <div class="condition_con">
            <!-- <el-input v-model="materialName" placeholder="输入材料名称"/> -->
            <el-table :data="matterMaterial" border :span-method="arraySpanMethod" @selection-change="handleSelectionChange">
                <el-table-column type="selection" :selectable="checkboxSelect" width="55" />
                <el-table-column label="材料名称">
                    <template #default="scope">
                        <span>{{ scope.row.mindex }}、{{ scope.row.materialName }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="sampleList" label="表格及样例下载">
                    <template #default="scope">
                        <span class="link_a" @click="fileDownloadHandler(scope.row.emptyTableId)">空表下载</span>
                        &nbsp;
                        <span class="link_a" @click="fileDownloadHandler(scope.row.sampleTableId)">样表下载</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="materClick">确认选择</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<style lang="less" scoped>
.condition_con {
    .el-input {
        width: 200px;
        margin-bottom: 10px;
    }
}

.link_a {
  width: 70px;
  text-align: center;
  padding: 3px;
  color: #2E73FE;
  text-decoration: none;
  cursor: pointer;
}
</style>