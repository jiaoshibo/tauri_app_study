<script setup lang="ts">
import { ref, onBeforeMount, reactive } from 'vue';
import type { FormInstance, FormRules } from 'element-plus'
import ArchorList from '@/components/ArchorList.vue'
import IsogenyvBasicForm from './components/IsogenyvBasicForm.vue'
import IsogenyMatter from './components/IsogenyMatter.vue'
import IsogenyMatterFlow from './components/IsogenyMatterFlow.vue'
import IsogenyResult from './components/IsogenyResult.vue'
import IsogenyAccording from './components/IsogenyAccording.vue'
import IsogenyvProblem from './components/IsogenyvProblem.vue'
import * as matterInfo from "@/axios/api/matterInfo";
import { ElMessage } from "element-plus";

import { useRoute } from 'vue-router';

const route = useRoute();

//左侧边栏数据
const archorData = ref<{ id: string; name: string }[]>([{
    id: "id1",
    name: "基本信息"
}, {
    id: "id2",
    name: "申请材料"
}, {
    id: "id3",
    name: "办理流程"
}, {
    id: "id4",
    name: "结果物名称及样本"
}, {
    id: "id5",
    name: "设定依据"
}, {
    id: "id6",
    name: "收费标准"
}, {
    id: "id7",
    name: "常见问题"
}])


//表单数据
interface RuleForm {
    name: string,
    ishigh: string
}
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
    name: '',
    ishigh: '1'
})

const options = [
    {
        value: '1',
        label: '是',
    },
    {
        value: '2',
        label: '否',
    }
]

interface tableData {
    id: string;
    situationName: string;
}
const tableData = ref<tableData[]>([{
    id: "1111",
    situationName: "11111"
}])

//基本信息
let syncBasic = ref()

//申请材料
let syncMaterial = ref<SyncMaterialObj[]>([])

//办理流程
let syncMatterProcess = ref([])

//结果物名称及样本
let syncMatterResult = ref<SyncMatterResultObj[]>([])

//设定依据
let syncDirectoryLaw = ref<SyncDirectoryLawObj[]>([])

//办理流程
let syncMatterSubProcess = ref<SyncMatterSubProcessObj[]>([])

//常见问题
let syncTaskGeneralQuestions = ref<SyncTaskGeneralQuestionsObj[]>([])

//结果物名称
let resltName = ref<string>("");
//删除
const deleteClick = () => { }

//计算结果
const inputVlue = ref()

interface HomologyInfoObj {
    isFee: string;
    feeStand: string;
    feeName: string;
    byLaw: string;
    isDesc: string;
    remark: string;
    [propName: string]: any
}
const homologyInfo = ref<HomologyInfoObj>({
    isFee: "",
    feeStand: "",
    feeName: "",
    byLaw: "",
    isDesc: "",
    remark: "",

})
//获取同源展示信息
function homology() {
    tableLoading.value = true
    matterInfo.homology(route.query.matterId as string).then(res => {
        let resData = res.data;
        if (resData.code === 2001) {
            syncBasic.value = { ...resData.data?.[0].syncBasic, ...resData.data?.[0].syncBasicExtend };
            syncMaterial.value = resData.data?.[0].syncMaterial ?? [];
            syncMatterResult.value = resData.data?.[0].syncMatterResult ?? [];
            syncDirectoryLaw.value = resData.data?.[0].syncDirectoryLaw ?? [];
            syncMatterSubProcess.value = resData.data?.[0].syncMatterSubProcess ?? [];
            syncTaskGeneralQuestions.value = resData.data?.[0].syncTaskGeneralQuestions ?? [];
            console.log('syncTaskGeneralQuestions---------11111', syncTaskGeneralQuestions.value)
            // syncMatterProcess.value = resData.data?.[0].syncMatterProcess ?? [];
            // syncMatterCharge.value = resData.data?.[0].syncMatterCharge ?? [];
            homologyInfo.value = { isFee: resData.data?.[0].syncBasic.isFee, ...resData.data?.[0].syncMatterCharge?.[0] };
            console.log('homologyInfo.value.isFee---', homologyInfo.value)
            if(syncMatterResult.value.length>0) {
                resltName.value = "";
                syncMatterResult.value.forEach((ele,index)=> {
                    resltName.value += `${index+1}、${ele.resultname}<br/>`
                })
                console.log('resltName.value', resltName.value)
            }
        } else {
            ElMessage.error(resData.message)
        }
    }).catch(() => {
        // ElMessage.error('服务器错误')
    }).finally(() => {
        tableLoading.value = false;
        // tableLoading.value = false;
    })
}
//是否收费下拉
const isFeeOptions = [{
    value: "0",
    label: '否'
}, {
    value: "1",
    label: '是'
}]
onBeforeMount(() => {
    homology()
})
const tableLoading = ref<boolean>(false)
</script>

<template>
    <div class="detail_formlist" v-loading="tableLoading">
        <div class="detail_formlist_left">
            <ArchorList class="archor-list" :archorData="archorData"></ArchorList>
        </div>
        <div class="detail_formlist_right">
            <!-- 基本信息 -->
            <div id="id1">
                <div class="formlist_title">
                    <div class="flt_left">
                        <span></span>
                        <h5>基本信息</h5>
                    </div>
                    <!-- <div class="flt_right">
                        <el-button type="primary" :icon="Edit">查看版本</el-button>
                    </div> -->
                </div>
                <IsogenyvBasicForm :syncBasic="syncBasic"></IsogenyvBasicForm>
            </div>
            <!-- 申请材料 -->
            <div id="id2">
                <div class="formlist_title">
                    <div class="flt_left">
                        <span></span>
                        <h5>申请材料</h5>
                    </div>
                </div>
                <IsogenyMatter :syncMaterial="syncMaterial"></IsogenyMatter>
            </div>
            <!-- 办理流程 -->
            <div id="id3" class="mt30">
                <div class="formlist_title">
                    <div class="flt_left">
                        <span></span>
                        <h5>办理流程</h5>
                    </div>
                    <!-- <div class="flt_right">
                        <el-button type="primary" :icon="Edit">查看版本</el-button>
                    </div> -->
                </div>
                <IsogenyMatterFlow :syncMatterSubProcess="syncMatterSubProcess" v-if="syncMatterSubProcess.length > 0" :resltName="resltName">
                </IsogenyMatterFlow>
            </div>
            <!-- 结果物名称及样本 -->
            <div id="id4" class="mt30">
                <div class="formlist_title">
                    <div class="flt_left">
                        <span></span>
                        <h5>结果物名称及样本</h5>
                    </div>
                </div>
                <IsogenyResult :is-eidit="false" :syncMatterResult="syncMatterResult"></IsogenyResult>
            </div>
            <!-- 设定依据 -->
            <div id="id5" class="mt30">
                <div class="formlist_title">
                    <div class="flt_left">
                        <span></span>
                        <h5>设定依据</h5>
                    </div>
                </div>
                <IsogenyAccording :sync-material="syncDirectoryLaw"></IsogenyAccording>
            </div>
            <!-- 收费标准 -->
            <div id="id6" class="mt30">
                <div class="formlist_title">
                    <div class="flt_left">
                        <span></span>
                        <h5>收费标准</h5>
                    </div>
                </div>
                <el-form :model="homologyInfo" :inline="true" label-width="180px" class="demo-ruleForm">
                    <el-form-item label="是否收费：" class="rest_form add_symbol">
                        <el-select v-model="homologyInfo.isFee" placeholder="请选择" disabled>
                            <el-option v-for="item in isFeeOptions" :key="item.value" :label="item.label"
                                :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <template v-if="homologyInfo.isFee == '1'">
                        <el-form-item label="收费项目名称：" class="rest_form add_symbol">
                            <el-input v-model="homologyInfo.feeName" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="收费标准：" class="rest_form add_symbol">
                            <el-input v-model="homologyInfo.feeStand" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="是否允许减免：" class="rest_form add_symbol">
                            <el-select v-model="homologyInfo.isDesc" placeholder="请选择" disabled>
                                <el-option v-for="item in isFeeOptions" :key="item.value" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="备注：" class="rest_form add_symbol">
                            <span v-if="!homologyInfo.remark" class="info_span">无</span>
                            <span v-else class="info_span">{{ homologyInfo.remark }}</span>
                        </el-form-item>
                        <el-form-item label="收费依据：" class="add_symbol">
                            <span class="info_span">{{ homologyInfo.byLaw }}</span>
                        </el-form-item>
                    </template>
                </el-form>
            </div>
            <!-- 常见问题 -->
            <div id="id7" class="mt30">
                <div class="formlist_title">
                    <div class="flt_left">
                        <span></span>
                        <h5>常见问题</h5>
                    </div>
                </div>
                <IsogenyvProblem :syncTaskGeneralQuestions=syncTaskGeneralQuestions></IsogenyvProblem>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.detail_formlist {
    display: flex;
    margin-top: 36px;

    .detail_formlist_left {
        width: 190px;
        flex-shrink: 0;
        position: relative;

        .archor-list {
            position: sticky;
            top: 20px;
        }
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

.form_item_flex {
    display: flex;
}

.count_div {
    display: flex;
    justify-content: space-between;
    margin-top: 30px;

    .el-button {
        margin-left: 12px;
    }

    .count_div_item {
        display: flex;
        width: 46%;
    }
}

.mt30 {
    margin-top: 30px;
}

:deep(.rest_form) {
    width: 46%;
}

:deep(.rest_form .el-select) {
    width: 100%;
}

:deep(.add_symbol .el-form-item__label:before) {
    content: '*';
    color: #409EFF;
    margin-right: 4px;
}

.info_span {
    width: 100%;
    padding: 6px 8px;
    color: var(--el-disabled-text-color);
    background: rgb(245, 247, 250);
    box-shadow: 0 0 0 1px var(--el-disabled-border-color) inset;
    border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
}
</style>