<!--
 * @Author: jiaxiaorong jiaxiaorong@syngo.net
 * @Date: 2023-10-24 10:30:58
 * @LastEditors: jiaxiaorong jiaxiaorong@syngo.net
 * @LastEditTime: 2023-10-26 09:43:13
 * @FilePath: \syngo-yckt-matter-library-web\src\views\Matter\MatterList.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script lang="ts" setup>
import { ref, onBeforeMount,markRaw } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Layout from '@/components/ListPageLayout.vue'
import BasicList from './BasicList.vue'
import ApplicationMatter from './ApplicationMatter.vue'
import HomologyData from './HomologyData.vue'
import { getChangeField } from "@/axios/api/taskCount";
import { ElMessage } from "element-plus";
const route = useRoute();
const router = useRouter();
const pageTitle = ref(['事项管理', '查看详情'])
import {
    WarnTriangleFilled
} from '@element-plus/icons-vue'

type ComName = typeof BasicList | typeof ApplicationMatter | typeof HomologyData

//事项情形名称
const stationsData = ref<string[]>([])

// tab切换
function tabLiClick(id: number) {
    isActive.value = id;

    const getComName = new Map<number, ComName>([[0, BasicList], [1, ApplicationMatter], [2, HomologyData]])

    // comName.value = getComName[id] ?? ""

    comName = getComName.get(id)??{};
}
// 获取tab标签
function getTabNav(type: string) {
    const getNav = new Map<string, string[]>([['1', ['事项管理', '查看详情']], ['2', ['事项异动', '版本修改']], ['3', ['未进驻事项', '查看详情']], ['4', ['事项异动', '查看详情']]])


    pageTitle.value = getNav.get(type) ?? [];
}
//tab切换
const tabLiData = ref<{ id: number; name: string }[]>([{
    id: 0,
    name: "基本信息"
}, {
    id: 1,
    name: "申请材料"
}, {
    id: 2,
    name: "首都之窗同源展示"
}])


// 选中标识
const isActive = ref<number>(0)

//动态组件默认显示
let comName = markRaw<ComName|{}>({});

onBeforeMount(() => {
    getTabNav(route.query.type as string)
    if (route?.query?.type === '2') onGetChangeField()
    if (route?.query?.type === '3') {
        tabLiData.value = [{
            id: 2,
            name: "首都之窗同源展示"
        }]
        setTimeout(()=> {
            tabLiClick(2)
        },500)
    }else {
        tabLiClick(0)
    }
})
//获取版本对比结果
function onGetChangeField() {
    let data: TaskCount.GetChangeField = {
        taskGuid: route.query.taskGuid as string,
        taskCode: route.query.taskCode as string,
        taskType: route.query.taskType as string,
        cdBatchArr: route.query.cdBatchArr as string[],
    }
    getChangeField(data).then(res => {
        let resData = res.data;
        if (resData.code === 2001) {
            stationsData.value = resData.data;
        } else {
            ElMessage.error(resData.message)
        }
    }).catch(() => {
        ElMessage.error('服务器错误')
    }).finally(() => {
        // tableLoading.value = false;
    })
}
//返回上一页
 function goBack() {
    router.go(-1)
 }

</script>


<template>
    <layout :breadcrumb-item="pageTitle">
        <div class="vm_top" v-if="route?.query?.type === '2'">
            <div class="vm_top_tip">
                <el-icon>
                    <WarnTriangleFilled />
                </el-icon>
                <h5>提示</h5>
                <span>请核查以下字段：</span>
            </div>
            <ul>
                <li v-for="(item, index) in stationsData" :key="index">{{ item }}</li>
            </ul>
        </div>
        <div class="detail_con">
            <div class="detaill_title">
                <h5>{{ route.query.matterName }}</h5>
                <div class="title_right">
                    <el-button type="primary" @click="goBack">返回</el-button>
                    <!-- <span><label style="color:#409EFF">*</label> 为首都之窗同源数据</span>
                    <span><label style="color:#F56C6C">*</label> 为必填项</span> -->
                </div>
            </div>
            <div class="detail_form_con">
                <ul class="detail_tabs">
                    <li v-for="item in tabLiData" :key="item.id" :class="{ 'active': isActive === item.id }"
                        @click="tabLiClick(item.id)">{{ item.name }}</li>
                </ul>
                <!-- <BasicList></BasicList> -->
                <component :is="comName!"></component>
            </div>

        </div>
    </layout>
</template>

<style scoped lang="less">
.detail_con {
    margin: 0 24px;
    background: #fff;
    height: calc(100vh - 100px);
    box-sizing: border-box;
    overflow: hidden;

    .detaill_title {
        display: flex;
        justify-content: space-between;
        padding: 24px 24px 20px 24px;
        border-bottom: solid 1px #F0F4FA;
        background: linear-gradient(180deg, #EFF6FF 0%, #FFFFFF 44%);

        h5 {
            font-size: 20px;
            color: #262626;
        }

        .title_right {
            font-size: 14px;
            color: #3D3D3D;
        }
    }

    .detail_form_con {
        padding: 0 24px 24px;
    }

    .detail_tabs {
        margin-top: 34px;
        display: flex;
        justify-content: space-between;

        li {
            width: 32%;
            height: 48px;
            line-height: 48px;
            font-size: 16px;
            color: #262626;
            text-align: center;
            background: #F5F7FC;
            cursor: pointer;
        }

        li.active {
            background: #2E73FE;
            color: #fff;
            border-radius: 2px;
        }
    }

    .detail_formlist {
        display: flex;
        margin-top: 36px;

        .detail_formlist_left {
            width: 190px;
            flex-shrink: 0;
        }

        .detail_formlist_right {
            flex: 1;
            height: calc(100vh - 300px);
            overflow: auto;
            .form_item_flex {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
            }
        }
    }
}

.formlist_title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;

    .flt_left {
        display: flex;
        align-items: center;

        span {
            width: 6px;
            height: 16px;
            background: #2E73FE;
            border-top-right-radius: 2px;
            border-bottom-right-radius: 2px;
        }

        h5 {
            margin-left: 8px;
            font-size: 18px;
            color: rgba(0, 0, 0, 0.85);
        }
    }
}

:deep(.form_item_flex .el-form-item) {
    width: 48%;
}

:deep(.el-select) {
    width: 100%;
}

#id4 {
    margin-top: 20px;
}

.vm_top {
    margin: 24px;
    margin-top: 0;
    padding: 22px 24px;
    background: #fff;

    .vm_top_tip {
        padding: 20px;
        display: flex;
        align-items: center;
        color: #8A6543;
        border-bottom: solid 2px #F1E9E7;

        h5 {
            margin: 0 16px 0 8px;
            font-size: 20px;
        }

        span {
            font-size: 14px;
        }
    }

    ul {
        display: flex;
        flex-wrap: wrap;

        li {
            margin: 14px 16px 0 0;
            padding: 6px 12px;
            font-size: 16px;
            color: #6C390A;
            background: #FFF3E8;
        }
    }
}
:deep(.el-input__inner) {
    height: 36px;
    line-height: 36px;
}

</style>