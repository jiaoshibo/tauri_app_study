<!--
 * @Author: jiaxiaorong jiaxiaorong@syngo.net
 * @Date: 2023-10-25 17:37:23
 * @LastEditors: jiaxiaorong jiaxiaorong@syngo.net
 * @LastEditTime: 2023-10-25 17:58:33
 * @FilePath: \syngo-yckt-matter-library-web\src\views\MatterDetails\components\IsogenyMatter.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup lang="ts">
import { ref } from 'vue';
const tableData: any = []
const checked1:boolean = true
const checked2:boolean = true

interface Props {
    syncMatterSubProcess: SyncMatterSubProcessObj[],
    resltName: string
}
const props = defineProps<Props>()

//申请与受理
let applyForData = ref<SyncMatterSubProcessObj[]>([])
//审查与决定
let examinationData = ref<SyncMatterSubProcessObj[]>([])
//颁证与送达
let issueCertificateData = ref<SyncMatterSubProcessObj[]>([])

let sendType = ref<string[]>([])
setTimeout(()=> {
    if(props.syncMatterSubProcess.length>0) {
        props.syncMatterSubProcess.forEach(ele=> {
            if(ele.phaseStdName=='申请与受理') {
                applyForData.value.push(ele)
            }else if(ele.phaseStdName=='审查与决定') {
                examinationData.value.push(ele)
            }else if(ele.phaseStdName=='制证' || ele.phaseStdName=='颁证') {
                issueCertificateData.value.push(ele)
            }
            if(ele.phaseStdName=='送达') {
                sendType.value = ele.sendType.split(",")
            }
        })
    }
    console.log('applyForData.value---', applyForData.value);
},1000)

</script>

<template>
    <div class="bill_materials">
        <h5>第1步 申请与受理</h5>
        <el-table :data="applyForData" border>
            <el-table-column prop="phaseName" label="办理步骤">
            </el-table-column>
            <el-table-column label="办理时限">
                <template #default="scoped">
                    <span>{{scoped.row.phaseLimit}}个工作日</span>
                </template>
            </el-table-column>
            <el-table-column prop="maybe" label="办理人员">
            </el-table-column>
            <el-table-column prop="phaseResult" label="办理结果">
            </el-table-column>
            <el-table-column prop="phaseApprove" label="审查标准">
            </el-table-column>
        </el-table>
        <h5>第2步 审查与决定</h5>
        <el-table :data="examinationData" border>
            <el-table-column prop="phaseName" label="办理步骤">
            </el-table-column>
            <el-table-column label="办理时限">
                <template #default="scoped">
                    <span v-if="scoped.row.phaseLimit">{{scoped.row.phaseLimit}}个工作日</span>
                </template>
            </el-table-column>
            <el-table-column prop="maybe" label="办理人员">
            </el-table-column>
            <el-table-column prop="phaseResult" label="办理结果">
            </el-table-column>
            <el-table-column prop="phaseApprove" label="审查标准">
            </el-table-column>
        </el-table>
        <h5>第3步 颁证与送达</h5>
        <el-table :data="issueCertificateData" border>
            <el-table-column prop="phaseName" label="办理步骤">
            </el-table-column>
            <el-table-column label="办理时限">
                <template #default="scoped">
                    <span>{{scoped.row.phaseLimit}}个工作日</span>
                </template>
            </el-table-column>
            <el-table-column prop="maybe" label="办理人员">
            </el-table-column>
            <!-- <el-table-column prop="phaseResult" label="办理结果">
            </el-table-column> -->
            <el-table-column label="结果名称">
                <template #default="scoped">
                    <span v-html="resltName" v-if="scoped.row.phaseName"></span>
                </template>
            </el-table-column>
        </el-table>
        <h5>送达方式</h5>
        <div>
            <el-checkbox-group v-model="sendType">
                <el-checkbox label="窗口领取" size="large" disabled />
                <el-checkbox label="邮寄送达" size="large" disabled />
            </el-checkbox-group>
        </div>
    </div>
</template>

<style lang="less" scoped>
.bill_materials {
    h5 {
        margin: 28px 0 18px 0;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.85);
    }
}
</style>