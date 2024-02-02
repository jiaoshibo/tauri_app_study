<!--
 * @Author: jiaxiaorong jiaxiaorong@syngo.net
 * @Date: 2023-10-24 17:23:23
 * @LastEditors: jiaxiaorong jiaxiaorong@syngo.net
 * @LastEditTime: 2023-10-26 11:32:32
 * @FilePath: \syngo-yckt-matter-library-web\src\views\MatterDetails\components\ConditionDialog.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import CelatedIssuesCom from './CelatedIssuesCom.vue'
import RemindCom from './RemindCom.vue'
import AuditMethodCom from './AuditMethodCom.vue'
import { ElMessage, ElMessageBox } from "element-plus";
import { useRoute } from 'vue-router';
import * as matterInfo from "@/axios/api/matterInfo";
import { queryMatterAcceptance, saveSituation, updSituation } from "@/axios/api/taskCount";
import { insertAcceptanceKey, updateAcceptanceKey, deleteAcceptanceKey } from "@/axios/api/bmgSituationMaterialAcceptanceKey";
import SelectMaterialCom from './SelectMaterialCom.vue'
const route = useRoute();
import {
    Plus
} from '@element-plus/icons-vue'

interface Props {
    isShow: boolean
}

const props = defineProps<Props>()
const isType = ref<number>(1)
import {
    QuestionFilled,
} from '@element-plus/icons-vue'
import { fa } from 'element-plus/es/locale/index.mjs'

//弹框ref
const CelatedIssuesComRef = ref<any>();
const AuditMethodComRef = ref<any>()
const RemindComRef = ref<any>()
const SelectMaterialComRef = ref<any>()
const matterIdV = ref<string>()
let situationNameV = ref<string>()
const situationId = ref<string>()
const openDialogType = (type: number, matterId: string = "", situationName: string = "", id: string = "") => {
    isType.value = type
    if (type === 1) {
        ruleForm.situationName = "";
        matterMaterial.value = [];
        auditMethodList.value.drawingRequired = "1"
        auditMethodList.value.drawingReviewMethod = ""
        auditMethodList.value.materialReviewMethod = ""
        auditMethodList.value.isMiddleMaterial = ""
    } else {
        matterIdV.value = matterId;
        situationNameV.value = situationName;
        onGetMaterialBySituation(matterId, situationName)
        onQueryMatterAcceptance(matterId, id)
        situationId.value = id;
    }
    setTimeout(() => {
        CelatedIssuesComRef?.value?.onGetAllMatterSelector()
        CelatedIssuesComRef.value.correlationMatterOptions.value = [];
    }, 300)
    // taskBasicInfo()
    selectCheckBoxSelect()
}
interface RuleForm {
    situationName: string;
    inSystem: string;
    outSystem: string;
    matterArea: string;
}
//表单数据
const ruleFormRef = ref<FormInstance>();
/**
 * 分流位置表单实例
 */
const DiversionPositionFormRef = ref<FormInstance>();
/**
 * 清理表单验证
 */
function clearDiversionPositionFormValidator (){
    DiversionPositionFormRef.value?.resetFields();
}

const ruleForm = reactive<RuleForm>({
    situationName: "",
    inSystem: "",
    outSystem: "",
    matterArea: ""
})

//公开性
const opennessOptions = [{
    value: "1",
    label: '公开'
}, {
    value: "0",
    label: '不公开'
}]
const fallibilityOptions = [{
    value: '0',
    label: '否'
}, {
    value: '1',
    label: '是'
}]
let matterMaterial = ref<MatterListObj[]>([])

//受理要点点击编辑
function editClick(i: number, idx: number) {
    matterMaterial.value[i].acceptanceKeyList[idx].disabled = false;
}
let situationDialoginfo = ref<SituationDialoginfoObj>()
//相关事项
let celatedIssuesData = ref<MatterRelevantList[]>([])
//审核方式
let auditMethodList = ref<AuditmethodObj>({
    drawingRequired: "1",
    drawingReviewMethod: "",
    materialReviewMethod: "",
    isMiddleMaterial: "",
})

//所在区域下拉
let areaOptions = ref<DictionaryObj[]>([])
//重点题型
let remindData = ref<MatterKeyReminder[]>([])
//删除填写要点
const deleteClick = (matterIndex: number, index: number) => {
    matterMaterial.value[matterIndex]?.acceptanceKeyList?.splice(index, 1);
}
//下拉字段
function selectCheckBoxSelect() {
    matterInfo.selectCheckBoxSelect("BLQY").then(res => {
        let resData = res.data;
        if (resData.code === 2001) {
            areaOptions.value = resData.data;
        } else {
            ElMessage.error(resData.message)
        }
    }).catch(() => {
        ElMessage.error('服务器错误')
    }).finally(() => {
        // tableLoading.value = false;
    })
}
//添加填写要点
const addTableRow = (scope: any) => {
    let obj = {
        acceptanceKey: "",
        acceptanceKeyPublicity: "",
        fillInKey: "",
        isFalliblePoint: "",
        fillInRemind: "",
        situationId: scope.row.situationId,
        matterId: scope.row.matterId,
        materialId: scope.row.materialId
    }
    matterMaterial.value[scope.$index]?.acceptanceKeyList?.push(obj);
}
//获取材料信息
function onGetMaterialBySituation(matterId: string, situationName: string) {
    let data = {
        matterId,
        situationName
    }
    matterInfo.getMaterialBySituation(data).then(res => {
        let resData = res.data;
        if (resData.code === 2001) {
            matterMaterial.value = resData.data;
            if (matterMaterial.value.length > 0) {
                matterMaterial.value.forEach(i => {
                    if (i.acceptanceKeyList.length > 0) {
                        i.acceptanceKeyList.forEach(ele => {
                            ele.disabled = true
                        })
                    }
                })
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
//获取事项详情-添加情形-查询重点案例
function onQueryMatterAcceptance(matterId: string, situationId: string) {
    let data = {
        matterId,
        situationId
    }
    queryMatterAcceptance(data).then(res => {
        let resData = res.data;
        if (resData.code === 2001) {
            ruleForm.situationName = resData.data.situationName;
            ruleForm.inSystem =  resData.data.inSystem;
            ruleForm.outSystem =  resData.data.outSystem;
            ruleForm.matterArea =  resData.data.matterArea;
            situationDialoginfo.value = resData.data;
            celatedIssuesData.value = resData.data.matterRelevantList
            remindData.value = resData.data.matterKeyReminders
            auditMethodList.value.drawingRequired = resData.data.drawingRequired
            auditMethodList.value.drawingReviewMethod = resData.data.drawingReviewMethod
            auditMethodList.value.materialReviewMethod = resData.data.materialReviewMethod
            auditMethodList.value.isMiddleMaterial = resData.data.isMiddleMaterial
        } else {
            ElMessage.error(resData.message)
        }
    }).catch(() => {
        ElMessage.error('服务器错误')
    }).finally(() => {
        // tableLoading.value = false;
    })
}

//添加情形
function onSaveSituation(data: TaskCount.SaveSituationobj) {
    saveSituation(data).then(res => {
        let resData = res.data;
        if (resData.data) {
            ElMessage.success("操作成功！")
        } else {
            ElMessage.error(resData.message)
        }
    }).catch(() => {
        ElMessage.error('服务器错误')
    }).finally(() => {
        // tableLoading.value = false;
    })
}
//编辑情形
function onUpdSituation(data: TaskCount.SaveSituationobj) {
    updSituation(data).then(res => {
        let resData = res.data;
        if (resData.data) {
            ElMessage.success("操作成功！")
        } else {
            ElMessage.error(resData.message)
        }
    }).catch(() => {
        ElMessage.error('服务器错误')
    }).finally(() => {
        // tableLoading.value = false;
    })
}

//保存情形
const onSubmitSituation: ()=>Promise<boolean> = async () => {
    try {
        let formValitationResult = await DiversionPositionFormRef.value?.validate()
        if (formValitationResult) {
            let situationMaterial: TaskCount.SituationMaterialObj[] = []
            let acceptData = matterMaterial.value.map(ele => ele.acceptanceKeyList).flat(2)
            if (acceptData.length > 0) {
                acceptData.forEach(ele => {
                    delete ele.disabled
                })
            }
            let data = {
                situationMaterial: situationMaterial,
                situationData: {
                    situationName: ruleForm.situationName,
                    drawingRequired: auditMethodList.value.drawingRequired,
                    drawingReviewMethod: auditMethodList.value.drawingReviewMethod,
                    materialReviewMethod: auditMethodList.value.materialReviewMethod,
                    isMiddleMaterial: auditMethodList.value.isMiddleMaterial,
                    matterId: route.query.matterId as string,
                    matterName: route.query.matterName as string,
                    situationId: situationId.value,
                    matterArea: ruleForm.matterArea
                },
                materialAcceptanceKey: acceptData as AcceptanceKeyList[],
                matterRelevantData: CelatedIssuesComRef.value.relatedList.filter((ele:MatterRelevantList)=> ele.relevantMattersName),
                matterKeyReminderData: RemindComRef.value.remindList.filter((ele:MatterKeyReminder)=> ele.keyReminder)
            }
            if (matterMaterial.value.length > 0) {
                matterMaterial.value.forEach(ele => {
                    let obj = {
                        // id: ele?.id ?? "",
                        materialId: ele.materialId,
                        materialName: ele.materialName,
                        situationId: ele?.situationId ?? "",
                        matterId: ele.matterId,
                        parentId: ""
                    }
                    data.situationMaterial.push(obj)
                })
            }
            console.log('data------------', JSON.stringify(data))
            if (isType.value === 1) {
                delete data.situationData.situationId
                onSaveSituation(data)
            } else {
                onUpdSituation(data)
            }
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
    
}
//选择材料弹框
const selectMatterClick = () => {
    SelectMaterialComRef.value.openDialog()
}
//获取选择材料
const materClick = (val: TaskCount.SelectMaterialByMatterObj[]) => {
    console.log('val--', val)
    if (val.length > 0) {
        val.forEach(ele => {
            let obj = {
                materialId: ele.materialId,
                materialName: ele.materialName,
                matterId: ele.matterId,
                situationId: "",
                acceptanceKeyList: []
            }
            matterMaterial.value.push(obj)
        })
    }

}

//取消选择
const deselectClick = (index: number) => {
    if (matterMaterial.value[index].acceptanceKeyList?.length > 0) {
        ElMessage.warning('材料存在受理要点请先删除受理要点')
    } else {
        matterMaterial.value?.splice(index, 1);
    }

}

//新增受理要点
function onInsertAcceptanceKey(data: AcceptanceKeyList) {
    insertAcceptanceKey(data).then(res => {
        let resData = res.data;
        if (resData.data) {
            onGetMaterialBySituation(matterIdV.value as string, situationNameV.value as string)
            ElMessage.success("操作成功！")
        } else {
            ElMessage.error(resData.message)
        }
    }).catch(() => {
        ElMessage.error('服务器错误')
    }).finally(() => {
        // tableLoading.value = false;
    })
}
//编辑受理要点
function onUpdateAcceptanceKey(data: AcceptanceKeyList) {
    updateAcceptanceKey(data).then(res => {
        let resData = res.data;
        if (resData.data) {
            onGetMaterialBySituation(matterIdV.value as string, situationNameV.value as string)
            ElMessage.success("操作成功！")
        } else {
            ElMessage.error(resData.message)
        }
    }).catch(() => {
        ElMessage.error('服务器错误')
    }).finally(() => {
        // tableLoading.value = false;
    })
}
//删除受理要点
function onDeleteAcceptanceKey(id: string) {
    ElMessageBox.confirm('确认删除当前项？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        deleteAcceptanceKey(id).then(res => {
            if (res.data.code == 2001) {
                if (res.data.data === true) {
                    onGetMaterialBySituation(matterIdV.value as string, situationNameV.value as string)
                    ElMessage.success('删除成功');
                } else {
                    ElMessage.error('删除失败');
                }
            }
        })
    })
}

//保存受理要点
function onSubmitAccept(row: AcceptanceKeyList, id: string = "", i: number, idx: number) {
    if (id) {
        onUpdateAcceptanceKey(row)
    } else {
        onInsertAcceptanceKey(row)
    }
    matterMaterial.value[i].acceptanceKeyList[idx].disabled = true;
}



// 子组件默认包含是私有
defineExpose({
    onGetMaterialBySituation,
    onQueryMatterAcceptance,
    openDialogType,
    onSubmitSituation,
    clearDiversionPositionFormValidator
})

</script>

<template>
    <div class="condition_con">
        <el-form ref="ruleFormRef" :model="ruleForm" label-width="180px" class="demo-ruleForm" v-if="isShow">
            <el-form-item label="情形名称：">
                <el-input v-model="ruleForm.situationName" placeholder="请输入" />
                <span class="span_tip">说明：情形名称可为空，无情形时名称可不填写，以下信息仍需根据事项需要填写</span>
            </el-form-item>
        </el-form>
        <div id="id1">
            <div class="formlist_title" v-if="!isShow">
                <div class="flt_left">
                    <span></span>
                    <h5>申请材料</h5>
                </div>
            </div>
            <div class="dialog_div_card">
                <span v-if="isShow">申请材料：</span>
                <div class="dialog_div_card_right">
                    <el-button type="primary" @click="selectMatterClick" :icon="Plus" class="matter_btn"
                        v-if="isShow">选择材料</el-button>
                    <el-table :data="matterMaterial" border>
                        <el-table-column prop="materialName" label="材料名称" width="160">
                        </el-table-column>
                        <el-table-column prop="sampleList" label="表格及样例下载" width="100">
                        </el-table-column>
                        <el-table-column fixed="right">
                            <template #header>
                                <span>
                                    受理要点
                                    <el-tooltip class="item" effect="dark"
                                        content=" 受理要点为接件过程中窗口人员对办事人提交材料的材料接件要求。可公示的受理要点可向办事人展示，内部受理要点是窗口人员可见但因政策或其它原因办事人不可见内容。受理要点是否可公示，以该受理要点是否有可公示政策依据为准。"
                                        placement="top">
                                        <el-icon>
                                            <QuestionFilled />
                                        </el-icon>
                                    </el-tooltip>
                                </span>
                            </template>
                            <template #default="scope">
                                <el-table :data="scope.row.acceptanceKeyList" border>
                                    <el-table-column label="受理要点">
                                        <template #default="scope">
                                            <el-input v-model="scope.row.acceptanceKey"
                                                :disabled="scope.row.disabled"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="受理要点公开性">
                                        <template #default="scope">
                                            <el-select v-model="scope.row.acceptanceKeyPublicity" placeholder="请选择"
                                                :disabled="scope.row.disabled">
                                                <el-option v-for="item in opennessOptions" :key="item.value"
                                                    :label="item.label" :value="item.value"></el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="填写点是否是易错点">
                                        <template #default="scope">
                                            <el-select v-model="scope.row.isFalliblePoint" placeholder="请选择"
                                                :disabled="scope.row.disabled">
                                                <el-option v-for="item in fallibilityOptions" :key="item.value"
                                                    :label="item.label" :value="item.value"></el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="填写提醒">
                                        <template #default="scope">
                                            <el-input v-model="scope.row.fillInRemind"
                                                :disabled="scope.row.disabled"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column fixed="right" label="操作">
                                        <template #default="scope1">
                                            <el-button type="primary" size="small"
                                                @click="onSubmitAccept(scope1.row, scope1.row?.id, scope.$index, scope1.$index)"
                                                v-if="scope.row?.id && !scope1.row.disabled">保存</el-button>
                                            <!-- <el-button type="primary" size="small" @click="onUpdateAcceptanceKey(scope1.row)"
                                                v-if="scope.row?.id && scope1.row?.id">编辑</el-button> -->
                                            <el-button type="primary" size="small"
                                                @click="editClick(scope.$index, scope1.$index)"
                                                v-if="scope.row?.id && scope1.row?.id && scope1.row.disabled">编辑</el-button>
                                            <el-button link type="danger" v-if="!scope1.row?.id"
                                                @click="deleteClick(scope.$index, scope1.$index)">删除</el-button>
                                            <el-button link type="danger" v-else
                                                @click="onDeleteAcceptanceKey(scope1.row.id)">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <div class="table_add" @click="addTableRow(scope)">
                                    + 添加受理要点
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column fixed="right" label="操作" width="100" v-if="isShow">
                            <template #default="scope">
                                <el-button link type="danger" @click="deselectClick(scope.$index)">取消选择</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
        <div id="id2">
            <div class="formlist_title" v-if="!isShow">
                <div class="flt_left">
                    <span></span>
                    <h5>受理标准</h5>
                </div>
            </div>
            <div class="dialog_div_card">
                <span v-if="isShow">受理标准：</span>
                <div class="dialog_div_card_right">
                    <div class="xgsx_div">
                        <div class="card_title">相关事项 <el-tooltip class="item" effect="dark"
                                content="相关事项为办理此事项前，提醒办事人需办理哪些事项的提醒内容，查询选择事项库确认相关事项。" placement="top">
                                <el-icon>
                                    <QuestionFilled />
                                </el-icon>
                            </el-tooltip>
                        </div>
                        <CelatedIssuesCom ref="CelatedIssuesComRef" :celatedIssuesData="celatedIssuesData">
                        </CelatedIssuesCom>
                    </div>
                    <div class="audit_method">
                        <div class="audit_method_title">审核方式</div>
                        <div class="audit_method_form">
                            <AuditMethodCom :auditMethodList="auditMethodList" ref="AuditMethodComRef"></AuditMethodCom>
                        </div>
                    </div>
                    <div class="remind_div">
                        <div class="card_title">重点提醒 <el-tooltip class="item" effect="dark"
                                content="公示：即内容有政策依据，且办事人可查询到该政策依据。告知：即提醒内容有政策依据，政策依据外网查询不到但可向办事人展示该政策文本文件。解释：提醒内容无明文规定或有相关保密要求，只可口头向办事人说明。"
                                placement="top">
                                <el-icon>
                                    <QuestionFilled />
                                </el-icon>
                            </el-tooltip> </div>
                        <RemindCom :remindData="remindData" ref="RemindComRef"></RemindCom>
                    </div>
                    <div class="series_quadrat">
                        <h5>重点提醒填写样例</h5>
                        <ul>
                            <li>具体提醒内容具体提醒内容</li>
                            <li>示例提醒内容</li>
                            <li>公告</li>
                        </ul>
                    </div>
                </div>

            </div>
            <div class="formlist_title">
                <div class="flt_left">
                    <span></span>
                    <h5>分流位置</h5>
                </div>
            </div>
            <el-form ref="DiversionPositionFormRef" :model="ruleForm" label-width="140px" class="demo-ruleForm">
                <div class="form_item_flex">
                    <el-form-item label="预约分流：">
                        <span class="info_span" v-if="ruleForm.inSystem == '1'"> 一号位 </span>
                        <span class="info_span" v-else-if="ruleForm.inSystem == '2'"> 二号位 </span>
                        <span class="info_span" v-else-if="ruleForm.inSystem == '3'"> 自助机 </span>
                        <el-input v-model="ruleForm.inSystem" placeholder="预约分流" disabled v-else />
                    </el-form-item>
                    <el-form-item label="委派分流：">
                        <el-input v-model="ruleForm.outSystem" placeholder="委派分流" disabled />
                    </el-form-item>
                </div>
                <div class="form_item_flex">
                    <el-form-item label="办理区域：" prop="matterArea" :rules="{required:true,message:'请选择办理区域',trigger:'change'}">
                        <el-select v-model="ruleForm.matterArea" placeholder="请选择">
                            <el-option v-for="item in areaOptions" :key="item.value" :label="item.content"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </div>
            </el-form>
        </div>

    </div>
    <!-- 选择材料弹框 -->
    <SelectMaterialCom ref="SelectMaterialComRef" @materClick="materClick"></SelectMaterialCom>
</template>

<style lang="less" scoped>
.span_tip {
    color: #FC8619;
    font-size: 12px;


}

.dialog_div_card {
    margin-top: 16px;
    display: flex;

    >span {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.85);
        flex-shrink: 0;
    }

    .dialog_div_card_right {
        flex: 1;
        overflow: auto;
    }
}

.table_add {
    margin-top: 6px;
    height: 36px;
    line-height: 36px;
    font-size: 14px;
    color: #2E73FE;
    text-align: center;
    border: 1px dashed #2E73FE;
    cursor: pointer;

}

.card_title {
    padding-left: 15px;
    height: 40px;
    line-height: 40px;
    color: rgba(0, 0, 0, 0.85);
    border: 1px solid #D9D9D9;
    background: #F7F7F7;
    box-sizing: border-box;
}

.audit_method {
    margin-top: 24px;
    border: 1px solid #D9D9D9;

    .audit_method_title {
        height: 40px;
        line-height: 40px;
        padding-left: 15px;
        background: #F7F7F7;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.85);
        border: 1px solid #D9D9D9;
        border-top: 0;
    }
}

.remind_div {
    margin-top: 24px;
}

.series_quadrat {
    margin-top: 10px;
    padding: 12px 16px;
    background: #F7F7F7;

    h5 {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.5);
    }

    ul {
        display: flex;
        margin-top: 12px;

        li {
            padding-left: 30px;
            margin-right: 6px;
            width: 32%;
            height: 40px;
            line-height: 40px;
            font-size: 14px;
            color: rgba(0, 0, 0, 0.5);
            background: #fff;
            box-sizing: border-box;
        }
    }
}

.matter_btn {
    margin-bottom: 10px;
    width: 102px;
    height: 40px;
    line-height: 40px;
    background: #F2F3F8;
    color: #165DFF;
    border: none;
}

:deep(.form_item_flex .el-form-item) {
    width: 40%;
}

#id2 {
    margin-top: 36px;
}

.form_item_flex {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

:deep(.form_item_flex .el-form-item) {
    width: 48%;
}

.formlist_title {
    margin-top: 20px;
}

.info_span {
    width: 100%;
    padding: 2px 8px;
    color: var(--el-disabled-text-color);
    background: rgb(245, 247, 250);
    box-shadow: 0 0 0 1px var(--el-disabled-border-color) inset;
    border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
}</style>