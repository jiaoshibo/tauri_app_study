
<script setup lang="ts">
import { ref, reactive, watchEffect } from 'vue';
import type { FormInstance } from 'element-plus'

//表单数据
const matterFillRef = ref<FormInstance>()
let homologyInfo = ref({
    matterName: "",
    matterMainName: "",
    matterSubName: "",
    deptName: "",
    serverType: "",
    taskType: "",
    handleType: "",
    handleMode: "",
    acceptCondition: "",
    transactTime: "",
    transactAddr: "",
    linkWay: "",
    telComplaint: "",
    catalogMatterCode: "",
    taskCode: "",
    taskHandleItem: "",
    powerSource: "",
    managerDept: "",
    entrustName: "",
    deptType: "",
    useLevel: "",
    businesscharacter: "",
    specialprocedure: "",
    approveLimitDivide: "",
    approveLimitDivideExp: "",
    anticipateDay: "",
    anticipateExplain: "",
    promiseDay: "",
    promiseExplain: "",
    halltype: "",
    ispayonline: "",
    otherdept: "",
    blprogress: "",
    itemYxxt: "",
    isexpress: "",
    declareway: "",
    limitexplain: "",
    servicetype: "",
    handlearea: "",
    supervisePhone: "",
    windowComplaint: "",
    linkTel: "",
    linkWindow: "",
    linkEmail: "",
    datajsontext: "",
    letterComplaint: "",
    emailComplaint: "",
    linkWeb: "",
    linkLetter: "",
    internalDept: ""
})
const props = defineProps(['syncBasic'])

watchEffect(() => {
    if (props.syncBasic?.id) {
        homologyInfo.value = { ...props.syncBasic };
        if (homologyInfo.value.anticipateDay) homologyInfo.value.anticipateDay = homologyInfo.value.anticipateDay + '工作日'
        if (homologyInfo.value.promiseDay) homologyInfo.value.promiseDay = homologyInfo.value.promiseDay + '工作日'
    }
})

</script>
<template>
    <table class="basic_table">
        <tbody>
            <tr>
                <th>事项名称</th>
                <td>{{ homologyInfo.matterName }}</td>
                <th>事项主项</th>
                <td>{{ homologyInfo.matterMainName }}</td>
            </tr>
            <tr>
                <th>事项子项名称</th>
                <td>{{ homologyInfo.matterSubName }}</td>
                <th>实施主体</th>
                <td>{{ homologyInfo.deptName }}</td>
            </tr>
            <tr>
                <th>服务对象</th>
                <td>{{ homologyInfo.serverType }}</td>
                <th>事项类型</th>
                <td>{{ homologyInfo.taskType }}</td>
            </tr>
            <tr>
                <th>办理形式</th>
                <td>{{ homologyInfo.handleType }}</td>
                <th>受理条件</th>
                <td>{{ homologyInfo.acceptCondition }}</td>
            </tr>
            <tr>
                <th>办理时间</th>
                <td>{{ homologyInfo.transactTime }}</td>
                <th>办理地点</th>
                <td>{{ homologyInfo.transactAddr }}</td>
            </tr>
            <tr>
                <th>咨询方式</th>
                <td>
                    <span v-if="homologyInfo.linkEmail"> 咨询邮箱：{{ homologyInfo.linkEmail }} </span><br />
                    <span>咨询电话：{{ homologyInfo.linkTel }}</span><br />
                    <span v-if="homologyInfo.linkWindow">咨询窗口地址：{{ homologyInfo.linkWindow }}</span><br />
                    <span v-if="homologyInfo.linkWeb"> 网上咨询：{{ homologyInfo.linkWeb }} </span><br />
                    <span v-if="homologyInfo.linkLetter"> 咨询信件地址：{{ homologyInfo.linkLetter }} </span>
                </td>
                <th>投诉监管方式</th>
                <td>
                    投诉监督电话：{{ homologyInfo.supervisePhone }}<br />
                    <span v-if="homologyInfo.windowComplaint">投诉窗口地址：{{ homologyInfo.windowComplaint }}</span><br />
                    <span v-if="homologyInfo.letterComplaint">信件投诉地址：{{ homologyInfo.letterComplaint }}</span><br />
                    <span v-if="homologyInfo.emailComplaint">投诉邮箱：{{ homologyInfo.emailComplaint }}</span>
                </td>
            </tr>
            <tr>
                <th>基本编码</th>
                <td>{{ homologyInfo.catalogMatterCode }}</td>
                <th>事项编码</th>
                <td>{{ homologyInfo.taskCode }}</td>
            </tr>
            <tr>
                <th>业务办理项编码</th>
                <td>{{ homologyInfo.taskHandleItem }}</td>
                <th>进驻大厅类型</th>
                <td>{{ homologyInfo.halltype }}</td>
            </tr>
            <tr>
                <th>权利来源</th>
                <td>{{ homologyInfo.powerSource }}</td>
                <th>网上支付</th>
                <td>{{ homologyInfo.ispayonline }}</td>
            </tr>
            <tr>
                <th>所属机构</th>
                <td>{{ homologyInfo.internalDept ?  homologyInfo.internalDept : homologyInfo.deptName }}</td>
                <th>委托部门</th>
                <td>{{ homologyInfo.entrustName }}</td>
            </tr>
            <tr>
                <th>联办机构</th>
                <td>{{ homologyInfo.otherdept }}</td>
                <th>实施主体性质</th>
                <td>{{ homologyInfo.deptType }}</td>
            </tr>
            <tr>
                <th>办理进程查询途径</th>
                <td>
                    现场查询：{{ JSON.parse(homologyInfo.datajsontext)?.BLPROGRESS_ADDR }}<br />
                    电话查询：{{ JSON.parse(homologyInfo.datajsontext)?.BLPROGRESS_TEL }}
                </td>
                <th>行使层级</th>
                <td>{{ homologyInfo.useLevel }}</td>
            </tr>
            <tr>
                <th>运行系统</th>
                <td>{{ homologyInfo.itemYxxt }}</td>
                <th>物流快递</th>
                <td>{{ homologyInfo.isexpress }}</td>
            </tr>
            <tr>
                <th>办理方式</th>
                <td>{{ homologyInfo.handleMode }}</td>
                <th>预约办理</th>
                <td>{{ homologyInfo.declareway }}</td>
            </tr>
            <tr>
                <th>数量限制</th>
                <td>{{ homologyInfo.limitexplain }}</td>
                <th>中介服务</th>
                <td>{{ homologyInfo.servicetype }}</td>
            </tr>
            <tr>
                <th>权限划分</th>
                <td>{{ homologyInfo.approveLimitDivide }}</td>
                <th>通办范围</th>
                <td>{{ homologyInfo.handlearea }}</td>
            </tr>
            <tr>
                <th>特别程序</th>
                <td>{{ homologyInfo.specialprocedure }}</td>
                <th>行使内容</th>
                <td>{{ homologyInfo.approveLimitDivideExp }}</td>
            </tr>
            <tr>
                <th>法定办结时限</th>
                <td>{{ homologyInfo.anticipateDay || "无"}}</td>
                <th>法定办结时限说明</th>
                <td>{{ homologyInfo.anticipateExplain }}</td>
            </tr>
            <tr>
                <th>承诺办结时限</th>
                <td>{{ homologyInfo.promiseDay}}</td>
                <th>办件承诺办结时限说明</th>
                <td>{{ homologyInfo.promiseExplain }}</td>
            </tr>
        </tbody>
    </table>
</template>

<style lang="less" scoped>
.basic_table {
    margin-bottom: 26px;
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    font-size: 14px;
    border: 1px solid #dce0e8;

    th {
        width: 16%;
        background: #F5F7FC;
        border-bottom: 1px solid #dce0e8;
    }

    td {
        width: 30%;
        padding: 10px 20px;
        border: 1px solid #dce0e8;
    }
}
</style>