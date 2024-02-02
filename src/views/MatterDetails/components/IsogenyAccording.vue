<!--
 * @Author: jiaxiaorong jiaxiaorong@syngo.net
 * @Date: 2023-10-25 17:37:23
 * @LastEditors: jiaxiaorong jiaxiaorong@syngo.net
 * @LastEditTime: 2023-10-25 18:35:19
 * @FilePath: \syngo-yckt-matter-library-web\src\views\MatterDetails\components\IsogenyMatter.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup lang="ts">
interface Props {
    syncMaterial: SyncDirectoryLawObj[]
}
const props = defineProps<Props>()
</script>

<template>
    <div v-for="item in syncMaterial" :key="item.id" class="law_conten">
        <div class="law_title"><span>【{{ item.lawType }}】</span>{{ item.lawName }}</div>
        <el-table :data="[item]" border>
            <el-table-column prop="lawOwner" label="制定机关">
            </el-table-column>
            <el-table-column prop="lawName" label="依据名称">
            </el-table-column>
            <el-table-column prop="lawCode" label="发布号令（文号）">
            </el-table-column>
            <el-table-column label="法条（具体规定）内容">
                <template #default="scoped">
                    <p v-html="scoped.row.lawContent.replace(/\n/g, '<br>')"></p>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<style lang="less" scoped>
.law_conten{
    margin-bottom: 10px;
}
.law_title {
    padding: 12px;
    border: solid 1px #ebeef5;
    background: #f5f7fa;
    border-bottom: 0;
    color: #606266;
}
</style>