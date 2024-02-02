<!--
 * @Author: jiaxiaorong jiaxiaorong@syngo.net
 * @Date: 2023-10-24 09:56:30
 * @LastEditors: jiaxiaorong jiaxiaorong@syngo.net
 * @LastEditTime: 2023-10-24 10:58:55
 * @FilePath: \syngo-yckt-matter-library-web\src\components\ListPageLayout.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!-- 表格页的布局框架 -->

<template>
<div class="page_con">
    <div class="page_header">
        <el-breadcrumb :separator-icon="ArrowRight">
            <el-breadcrumb-item v-for="item in props.breadcrumbItem" :key="item">{{ item }}</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="page_main_content" v-if="!$slots.default">
        <!-- 搜索区域 -->
        <slot name="searchCard"></slot>
        <!-- 表格和分页区域 -->
        <div class="main-content">
            <slot name="tableContent"></slot>
            <slot name="pagination"></slot>   
        </div>
    </div>
    <div class="default-slot-style" v-else>
        <slot></slot>
    </div>
</div>
</template>

<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'

interface Props {
    /**
     * 面包屑导航
     */
    breadcrumbItem:string[]
}

const props = defineProps<Props>()

</script>

<style lang="less" scoped>
.default-slot-style{
    margin-top: 20px;
}
</style>
