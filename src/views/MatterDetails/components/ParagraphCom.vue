<template>
    <div class="roadshowDescValueDiv">
        <div ref="desContent" class="desContent" :class="{ 'show-all': desShowAll }">
            <span>{{ text }}</span>
        </div>
        <a v-if="desTextRows > 2" class="toggle" @click.prevent="toggleShow">
            {{ desShowAll ? '收起' : '展开' }}
        </a>
    </div>
</template>
  
<script setup lang="ts">
import { ref, watchEffect } from 'vue';
interface Props {
    text: string
}
const props = defineProps<Props>()
const desShowAll = ref(false);
const desTextRows = ref(0);

// 使用 watchEffect 监听文本变化和 showAll 变化，更新 textRows
const desContent = ref<any>();
watchEffect(() => {
    if (desContent.value) {
        // 计算文本占据的行数
        const lineHeight = parseFloat(window.getComputedStyle(desContent.value).lineHeight);
        const height = desContent.value.scrollHeight;
        desTextRows.value = Math.ceil(height / lineHeight);
        console.error(lineHeight, height, desTextRows.value);
    }
});
const toggleShow = () => {
    desShowAll.value = !desShowAll.value;
};
</script>
  
<style scoped lang="less">
.roadshowDescValueDiv {
    position: relative;

    .desContent {
        position: relative;
        font-size: 15px;
        line-height: 24px;
        word-break: break-all;
        display: -webkit-box;
        overflow: hidden;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }

    .show-all {
        -webkit-line-clamp: unset;
    }

    .toggle {
        margin-top: 10px;
        cursor: pointer;
        font-size: 12px;
        font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        font-weight: 400;
        color: #5e58f6;
        line-height: 18px;
    }
}
</style>