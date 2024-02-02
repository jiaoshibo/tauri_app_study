<!--
 * @Author: jiaxiaorong jiaxiaorong@syngo.net
 * @Date: 2023-10-24 10:30:58
 * @LastEditors: jiaxiaorong jiaxiaorong@syngo.net
 * @LastEditTime: 2023-10-24 16:53:20
 * @FilePath: \syngo-yckt-matter-library-web\src\views\Matter\MatterList.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script lang="ts" setup>
import { ref, onBeforeMount, reactive } from 'vue';
import type { FormInstance, FormRules } from 'element-plus'
import { useRoute, useRouter } from 'vue-router';
import ArchorList from '@/components/ArchorList.vue'
import KnowledgeCom from './components/KnowledgeCom.vue'
import CaseCom from './components/CaseCom.vue'
import * as matterInfo from "@/axios/api/matterInfo";
import { calculateRuleSingleMatter, updMatterBasic } from "@/axios/api/taskCount";
import { ElMessage, ElMessageBox } from "element-plus";
import type { UploadProps, UploadUserFile } from 'element-plus'
import * as __axios_api_taskCount from '@/axios/api/taskCount';

import {
    Edit,
    Upload,
    Download
} from '@element-plus/icons-vue'

const route = useRoute();
const router = useRouter();

//默认禁止编辑
const disabled = ref<boolean>(true)
//知识库
const knowledgeData = ref<KnowledgeObj[]>([])
//案例库
const caseData = ref<CaseObj[]>([])

//左侧边栏数据
const archorData = ref<{ id: string; name: string }[]>([{
    id: "id1",
    name: "进厅信息"
}, {
    id: "id2",
    name: "基本信息"
}, {
    id: "id3",
    name: "知识库问答"
}, {
    id: "id4",
    name: "案例库"
}])


//表单数据
const ruleFormRef = ref<FormInstance>()
interface FormObj {
    matterFloor: string;
    matterRegion: string;
    businessTypeId: string;
    handleProcedures: string;
    isWeb: string;
    [propName: string]: any
}
let basicForm = ref<FormObj>({
    matterFloor: "",
    matterRegion: "",
    businessTypeId: "",
    handleProcedures: "",
    isWeb: "",
    outputType: [],
    isTarger: "",
    inSystem: "",
    outSystem: ""
})

//楼层下拉
let floorOptions = ref<DictionaryObj[]>([])

//所在区域下拉
let areaOptions = ref<DictionaryObj[]>([])

//业务类型下拉
let businessTypeOptions = ref<DictionaryObj[]>([])

//人工梳理办理形式
let handleProceduresoptions = ref<DictionaryObj[]>([])


//是否下拉
const isOptions = [{
    value: 0,
    content: "否"
}, {
    value: 1,
    content: "是"
},]
//是否可全程网办
const isWebOptions = [{
    value: '0',
    content: "否"
}, {
    value: '1',
    content: "是"
},]
//取件方式
let pickupMethodOptions = ref<DictionaryObj[]>([])

//导入知识库地址
const importKnowledgeUrl: string = "/sxkapi/backBmgCommonQa/importExcelRepository"

//导入案例库
const importCaseUrl: string = "/sxkapi/BmgSpecialCasesQa/importExcelCase"
//情形信息
const situationData = ref<SituationObj[]>([])
//获取事项详情
function taskBasicInfo() {
    const matterId = route.query.id as string
    matterInfo.taskBasicInfo(matterId).then(res => {
        let resData = res.data;
        if (resData.code === 2001) {
            knowledgeData.value = resData?.data?.[0]?.qa;
            caseData.value = resData.data?.[0]?.casesQa;
            situationData.value = resData.data?.[0].situation;
            basicForm.value = { outputType: resData?.data?.[0].outputType, ...resData?.data?.[0].basic };
            basicForm.value.outputType = basicForm.value.outputType ? basicForm.value.outputType.split(",") : [];
            idParams.value.matterId = basicForm.value.matterId
            idParams.value.situationId = basicForm.value.situationId
            setTimeout(() => {
                onGetSubInfoByMatterId()
            }, 200)
        } else {
            ElMessage.error(resData.message)
        }
    }).catch(() => {
        // ElMessage.error('服务器错误')
    }).finally(() => {
        // tableLoading.value = false;
    })
}
//自动获取办件量、是否有情形、材料是否超过3个
function onGetSubInfoByMatterId() {
    const matterId = route.query.id as string
    __axios_api_taskCount.getSubInfoByMatterId(matterId).then(res => {
        let resData = res.data;
        if (resData.code === 2001) {
            basicForm.value.isBussiness = resData.data.is_bussiness
            basicForm.value.situationFlag = resData.data.situation_flag
            basicForm.value.materialCount = resData.data.material_count
        } else {
            ElMessage.error(resData.message)
        }
    }).catch(() => {
        ElMessage.error('服务器错误')
    }).finally(() => {
        // tableLoading.value = false;
    })
}
//下拉字段
function selectCheckBoxSelect(type: string) {
    matterInfo.selectCheckBoxSelect(type).then(res => {
        let resData = res.data;
        if (resData.code === 2001) {
            if (type === 'SZLC') floorOptions.value = resData.data;
            if (type === 'SZQY') areaOptions.value = resData.data;
            if (type === 'YWLX') businessTypeOptions.value = resData.data;
            if (type === 'RGSLBLXS') handleProceduresoptions.value = resData.data;
            if (type === 'QJFS') pickupMethodOptions.value = resData.data;
            // if (type === 'whether') isWebOptions.value = resData.data;
        } else {
            ElMessage.error(resData.message)
        }
    }).catch(() => {
        ElMessage.error('服务器错误')
    }).finally(() => {
        // tableLoading.value = false;
    })
}
//导入
const importSuccessHandel: UploadProps['onSuccess'] = (files, uploadFiles) => {
    if (files.code === 2001) {
        ElMessage.success(files.message)
        taskBasicInfo();
    } else {
        ElMessage.error(files.message)
    }
}

//计算结果---预约分流
const reservationNum = ref()
//计算结果---委派分流
const delegateNum = ref()

onBeforeMount(() => {
    taskBasicInfo()
    selectCheckBoxSelect('SZLC') //所在楼层
    selectCheckBoxSelect('SZQY') //所在区域
    selectCheckBoxSelect('YWLX') //所在区域
    selectCheckBoxSelect('RGSLBLXS') //业务类型
    // selectCheckBoxSelect('whether') //是否可全程网办
    selectCheckBoxSelect('QJFS') //取件方式
})

//计算结果
function ongetCalculateRuleSingleMatter(type: string, status: string) {
    const matterId = basicForm.value.matterId
    const situationId = basicForm.value.situationId
    calculateRuleSingleMatter(type, status, matterId, situationId).then(res => {
        let resData = res.data;
        if (resData.code === 2001) {
            if (type === '1') {
                reservationNum.value = resData.data
            } else {
                delegateNum.value = resData.data
            }
        } else {
            ElMessage.error(resData.message)
        }
    }).catch(() => {
        ElMessage.error('服务器错误')
    }).finally(() => {
        // tableLoading.value = false;
    })
}
//取消修改
function onClose() {
    disabled.value = true;
}
//修改基本信息
function onupdMatterBasic() {
    let data: TaskCount.UpdMatterBasicobj = {
        matterId: idParams.value.matterId,
        matterTeacherName: basicForm.value.matterTeacherName,
        matterTeacherJob: basicForm.value.matterTeacherJob,
        departmentLeaders: basicForm.value.departmentLeaders,
        substitutePersonnel: basicForm.value.substitutePersonnel,
        chiefRepresentative: basicForm.value.chiefRepresentative,
        materialCount: basicForm.value.materialCount,
        situationFlag: basicForm.value.situationFlag,
        isBussiness: basicForm.value.isBussiness,
        isRepeat: basicForm.value.isRepeat,
        isWeb: basicForm.value.isWeb,
        handleProcedures: basicForm.value.handleProcedures,
        businessTypeId: basicForm.value.businessTypeId,
        matterRegion: basicForm.value.matterRegion,
        matterFloor: basicForm.value.matterFloor,
        outputType: basicForm.value.outputType.join(","),
        isTarger: basicForm.value.isTarger,
    }
    updMatterBasic(data).then(res => {
        let resData = res.data;
        if (resData.code === 2001) {
            ElMessage({
                message: basicForm.value.isRepeat === '0'?'操作成功，即将返回事项管理页':'操作成功',
                type:'success',
                onClose() {
                    // 改为低频事项时返回事项列表页
                    if (basicForm.value.isRepeat === '0') {
                        router.replace('/matterList')
                    }else{
                        taskBasicInfo()
                    }
                },
            })
            disabled.value = true;
        } else {
            ElMessage.error(resData.message)
        }
    }).catch(() => {
        ElMessage.error('服务器错误')
    }).finally(() => {
        // tableLoading.value = false;
    })
}

//点击修改
const editClick = () => {
    disabled.value = false;
}
//获取情形id 事项id
const idParams = ref<{ matterId: string, situationId: string }>({
    matterId: "",
    situationId: "",
})
//判断是否有情形
const isRepeatChange = () => {
    if (situationData.value.length < 1 && basicForm.value.isRepeat === '1') {
        ElMessage.warning('调整事项为高频时需要先添加完善事项情形!')
        basicForm.value.isRepeat = '0'
    }
}
defineExpose({ taskBasicInfo })
</script>


<template>
    <div class="detail_formlist">
        <div class="detail_formlist_left">
            <ArchorList class="archor-list" :archorData="archorData"></ArchorList>
        </div>
        <div class="detail_formlist_right">
            <!-- 进厅信息（事项入驻后显示） -->
            <div id="id1">
                <div class="formlist_title">
                    <div class="flt_left">
                        <span></span>
                        <h5>进厅信息（事项入驻后显示）</h5>
                    </div>
                </div>
                <el-form ref="ruleFormRef" :model="basicForm" label-width="180px" class="demo-ruleForm">
                    <div class="form_item_flex">
                        <el-form-item label="事项负责老师：">
                            <el-input v-model="basicForm.matterTeacherName" placeholder="请输入" disabled />
                        </el-form-item>
                        <el-form-item label="事项负责老师岗位：">
                            <el-input v-model="basicForm.matterTeacherJob" placeholder="请输入" disabled />
                        </el-form-item>
                    </div>
                    <div class="form_item_flex">
                        <el-form-item label="处室领导：">
                            <el-input v-model="basicForm.departmentLeaders" placeholder="请输入" disabled />
                        </el-form-item>
                        <el-form-item label="首席代表">
                            <el-input v-model="basicForm.chiefRepresentative" placeholder="请输入" disabled />
                        </el-form-item>
                    </div>
                    <div class="form_item_flex">
                        <el-form-item label="代岗人员姓名">
                            <el-input v-model="basicForm.substitutePersonnel" placeholder="请输入" disabled />
                        </el-form-item>
                    </div>
                </el-form>
            </div>
            <!-- 基本信息 -->
            <div id="id2">
                <div class="formlist_title">
                    <div class="flt_left">
                        <span></span>
                        <h5>基本信息</h5>
                    </div>
                    <div class="flt_right">
                        <el-button type="primary" :icon="Edit" @click="editClick" v-if="disabled">修改</el-button>
                        <el-button type="primary" @click="onClose" v-if="!disabled">取消</el-button>
                        <el-button type="primary" :icon="Edit" @click="onupdMatterBasic" v-if="!disabled">保存</el-button>
                    </div>
                </div>
                <el-form ref="ruleFormRef" :model="basicForm" label-width="160px" class="demo-ruleForm">
                    <div class="form_item_flex rest_form">
                        <el-form-item label="所在楼层（运营管理处）：">
                            <el-select v-model="basicForm.matterFloor" placeholder="请选择" :disabled="disabled">
                                <el-option v-for="item in floorOptions" :key="item.value" :label="item.content"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="所在区域（运营管理处）：">
                            <el-select v-model="basicForm.matterRegion" placeholder="请选择" :disabled="disabled">
                                <el-option v-for="item in areaOptions" :key="item.value" :label="item.content"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="form_item_flex rest_form">
                        <el-form-item label="业务类型（运营管理处）：">
                            <el-select v-model="basicForm.businessTypeId" placeholder="请选择" :disabled="disabled" clearable>
                                <el-option v-for="item in businessTypeOptions" :key="item.value" :label="item.content"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="人工梳理办理形式（事项库运维）：">
                            <el-select v-model="basicForm.handleProcedures" placeholder="请选择" :disabled="disabled"
                                clearable>
                                <el-option v-for="item in handleProceduresoptions" :key="item.value" :label="item.content"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="form_item_flex rest_form">
                        <el-form-item label="是否可全程网办（事项库运维）：">
                            <el-select v-model="basicForm.isWeb" placeholder="请选择" :disabled="disabled" clearable>
                                <el-option v-for="item in isWebOptions" :key="item.value" :label="item.content"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                        <!-- <el-form-item label="取件方式（事项库运维）：">
                            <el-select v-model="basicForm.outputType" placeholder="请选择" multiple :disabled="disabled" clearable>
                                <el-option v-for="item in pickupMethodOptions" :key="item.value" :label="item.content"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item> -->
                    </div>
                </el-form>
                <!-- 高频低频事项 -->
                <div class="mt40">
                    <div class="formlist_title">
                        <div class="flt_left">
                            <span></span>
                            <h5>高频低频事项</h5>
                        </div>
                    </div>
                    <el-form ref="ruleFormRef" :model="basicForm" label-width="140px" class="demo-ruleForm">
                        <div class="form_item_flex">
                            <el-form-item label="是否高频事项：">
                                <el-select v-model="basicForm.isRepeat" placeholder="是否高频事项" :disabled="disabled"
                                    @change="isRepeatChange">
                                    <el-option v-for="item in isWebOptions" :key="item.value" :label="item.content"
                                        :value="item.value" />
                                </el-select>
                            </el-form-item>
                        </div>
                        <!-- <div class="form_item_flex">
                            <el-form-item label="是否手动编辑：">
                                <el-switch v-model="basicForm.isTarger" active-value="1" inactive-value="0"
                                    :disabled="disabled" />
                            </el-form-item>
                        </div>
                        <div class="form_item_flex">
                            <el-form-item label="是否有办件量：">
                                <el-select v-model="basicForm.isBussiness" placeholder="请选择"
                                    :disabled="basicForm.isTarger !== '1' || disabled">
                                    <el-option v-for="item in isOptions" :key="item.value" :label="item.content"
                                        :value="item.value" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="是否有情形：">
                                <el-select v-model="basicForm.situationFlag" placeholder="请选择"
                                    :disabled="basicForm.isTarger !== '1' || disabled">
                                    <el-option v-for="item in isOptions" :key="item.value" :label="item.content"
                                        :value="item.value" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="材料是否超过3个：">
                                <el-select v-model="basicForm.materialCount" placeholder="请选择"
                                    :disabled="basicForm.isTarger !== '1' || disabled">
                                    <el-option v-for="item in isOptions" :key="item.value" :label="item.content"
                                        :value="item.value" />
                                </el-select>
                            </el-form-item>
                        </div> -->
                    </el-form>
                    <!-- <div class="formlist_title">
                        <div class="flt_left">
                            <span></span>
                            <h5>分流位置</h5>
                        </div>
                    </div>
                    <el-form ref="ruleFormRef" :model="basicForm" label-width="140px" class="demo-ruleForm">
                        <div class="form_item_flex">
                            <el-form-item label="预约分流：">
                                <span class="info_span" v-if="basicForm.inSystem == 1"> 一号位 </span>
                                <span class="info_span" v-else-if="basicForm.inSystem == 2"> 二号位 </span>
                                <span class="info_span" v-else-if="basicForm.inSystem == 3"> 自助机 </span>
                                <el-input v-model="basicForm.inSystem" placeholder="预约分流" disabled v-else />
                            </el-form-item>
                            <el-form-item label="委派分流：">
                                <el-input v-model="basicForm.outSystem" placeholder="委派分流" disabled />
                            </el-form-item>
                        </div>
                    </el-form> -->
                </div>
            </div>
            <!-- 知识库问答（人工维护） -->
            <div id="id3">
                <div class="formlist_title">
                    <div class="flt_left">
                        <span></span>
                        <h5>知识库问答（人工维护）</h5>
                    </div>
                    <div class="flt_right">
                        <el-button type="primary" :icon="Download"
                            @click="() => { __axios_api_taskCount.downloadMatterQaExcel() }">下载模板</el-button>
                        <el-upload class="upload-demo" ref="upload" :action="importKnowledgeUrl"
                            :on-success="importSuccessHandel" :show-file-list="false"
                            :data="{ 'situationId': idParams.situationId }">
                            <el-button type="primary" :icon="Upload">导入</el-button>
                        </el-upload>
                    </div>
                </div>
                <div class="formlist_table">
                    <KnowledgeCom :knowledgeData="knowledgeData" :idParams="idParams"></KnowledgeCom>
                </div>
            </div>
            <!-- 案例库（人工维护） -->
            <div id="id4">
                <div class="formlist_title">
                    <div class="flt_left">
                        <span></span>
                        <h5>案例库（人工维护）</h5>
                    </div>
                    <div class="flt_right">
                        <el-button type="primary" :icon="Download"
                            @click="() => { __axios_api_taskCount.downloadMatterCasesQaExcel() }">下载模板</el-button>
                        <el-upload class="upload-demo" ref="upload" :action="importCaseUrl"
                            :on-success="importSuccessHandel" :show-file-list="false"
                            :data="{ 'situationId': idParams.situationId }">
                            <el-button type="primary" :icon="Upload">导入</el-button>
                        </el-upload>
                    </div>
                </div>
                <div class="formlist_table">
                    <CaseCom :caseData="caseData" :idParams="idParams"></CaseCom>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="less">
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

:deep(.form_item_flex .el-form-item) {
    width: 48%;
}

:deep(.el-select) {
    width: 100%;
}

:deep(.rest_form .el-form-item__label) {
    line-height: 22px;
}

#id4,
#id3,
#id2 {
    margin-top: 40px;
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

.flt_right {
    display: flex;

    .el-button {
        margin-left: 8px;
    }
}

.info_span {
    width: 100%;
    padding: 2px 8px;
    color: var(--el-disabled-text-color);
    background: rgb(245, 247, 250);
    box-shadow: 0 0 0 1px var(--el-disabled-border-color) inset;
    border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
}

.mt40 {
    margin-top: 40px;
}
</style>