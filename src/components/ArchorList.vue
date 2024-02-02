<!--
 * @Author: jiaxiaorong jiaxiaorong@syngo.net
 * @Date: 2023-10-24 13:14:53
 * @LastEditors: jiaxiaorong jiaxiaorong@syngo.net
 * @LastEditTime: 2023-10-25 19:55:39
 * @FilePath: \syngo-yckt-matter-library-web\src\components\ArchorList.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
interface Props {
    archorData: { id: string; name: string }[]
}
const props = defineProps<Props>()
let activeStep = ref<string>("id1")

// 点击侧边栏
function archorClick(id: string) {
    activeStep.value = id;
}
const handleScroll = (e: any) => {  //鼠标滑轮定位
    const scrollTop = e.target.scrollTop
    for (var index = 1; index < props.archorData.length+1; index++) {
        const scrollWrap = document.getElementById('id' + index)
        const offsetTop: number = scrollWrap?.offsetTop as number
        if (scrollTop >= offsetTop-300) {
            activeStep.value = "id"+index
        }
        if (scrollTop < 20) {
           activeStep.value = "id1"
        }
    }
}
onBeforeMount(() => {
    window.addEventListener('scroll', handleScroll, true)
})
</script>

<template>
    <ul class="archor_ul">
        <li v-for="item in archorData" :key="item.id" :class="activeStep === item.id ? 'archorActive' : ''"
            @click="archorClick(item.id)">
            <a :href="'#' + item.id">
                <span class="li_span_tip"></span>
                {{ item.name }}
            </a>
        </li>
    </ul>
</template>

<style lang="less" scoped>
.archor_ul {
    background: #FAFAFC;
    margin-right: 30px;
    li {
        height: 56px;
        line-height: 56px;
        font-size: 14px;
        color: #262626;
        cursor: pointer;
        border-bottom: 1px solid #fff;
        a {
            display: block;
            text-decoration: none;
            color: #262626;
        }
    }
}

.li_span_tip {
    margin-right: 10px;
    display: inline-block;
    width: 6px;
    height: 16px;
    border-top-right-radius: 2px;
    border-bottom-right-radius: 2px;
    vertical-align: middle;
}

li.archorActive {
    color: #2E73FE;
    background: #F5F7FC;
    a {
        color: #2E73FE;
    }

    .li_span_tip {
        background: #2E73FE;
    }
}</style>