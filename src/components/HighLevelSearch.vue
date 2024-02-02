<!-- 
    高级搜索
    绝对定位，需要一个父元素设置为 position: relative;
 -->
<script setup lang="ts">

interface Props {
    open: boolean
}

const props = defineProps<Props>()
</script>

<template>
    <el-collapse-transition>
    <div class="high-level-search" v-show="props.open">
        <slot></slot>
        <div v-if="$slots.footer" class="footer">
            <slot name="footer"></slot>
        </div>
    </div>
    </el-collapse-transition>
</template>
<style lang="less" scoped>
.high-level-search {
    position: absolute;
    top: 0;
    background-color: #ffffff;
    z-index: 1001;
    padding: 20px;
    left: 0;
    right: 0;
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.1);
    border-radius: 2px;

    .footer {
        text-align: right;
    }
}
</style>