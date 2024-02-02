<!--
 * @Author: jiaxiaorong jiaxiaorong@syngo.net
 * @Date: 2023-10-25 17:37:23
 * @LastEditors: jiaxiaorong jiaxiaorong@syngo.net
 * @LastEditTime: 2023-10-26 14:41:53
 * @FilePath: \syngo-yckt-matter-library-web\src\views\MatterDetails\components\IsogenyMatter.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup lang="ts">
import { ref } from 'vue'
import { downloadFileByDocId } from "@/axios/api/taskCount";
import { ElMessage } from "element-plus";
const value = ref('')
interface Props {
    isEidit: boolean,
    syncMatterResult: SyncMatterResultObj[]
}

const props = defineProps<Props>()
    const options = [
  {
    value: '是',
    label: '是',
  },
  {
    value: '否',
    label: '否',
  }
]
//下载表格地址
let downloadUrl = ref<string>("")
</script>

<template>
    <el-table :data="syncMatterResult" border>
        <el-table-column prop="resultname">
            <template #header>
                <span><i style="color: #409EFF">*</i>结果名称</span>
            </template>
        </el-table-column>
        <el-table-column prop="resulttype">
            <template #header>
                <span><i style="color: #409EFF">*</i>结果文书类型</span>
            </template>
        </el-table-column>
        <el-table-column>
            <template #header>
                <span><i style="color: #409EFF">*</i>结果样本</span>
            </template>
            <template #default="scope">
                <span class="link_a" @click="downloadFileByDocId(scope.row.docId)">{{scope.row.docName}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="resultLimit">
            <template #header>
                <span><i style="color: #409EFF">*</i>有效时间</span>
            </template>
        </el-table-column>
        <el-table-column prop="resultLimit" label="是否需要签字" v-if="isEidit">
            <template #default>
                <el-select v-model="value">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </template>
        </el-table-column>
    </el-table>
</template>

<style lang="less" scoped>
.link_a {
    color: #2E73FE;
    text-decoration: none;
    cursor: pointer;
}
</style>