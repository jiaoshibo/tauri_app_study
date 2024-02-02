<script setup lang="ts">
import { ref, inject, watchEffect } from 'vue'
import { ElMessage } from "element-plus";
import { getAllMatterSelector, getMatterAddr } from "@/axios/api/matterSituation";
import { useRoute } from 'vue-router';
import {
    Document
} from '@element-plus/icons-vue'
const route = useRoute();
interface Props {
    remindData: MatterKeyReminder[]
}
type idParams= {
    matterId: string,
    situationId: string,
}
let curAccount:idParams = inject('idParams') as idParams;
const props = defineProps<Props>()
let remindList = ref<MatterKeyReminder[]>([{
    matterId: curAccount.matterId,
    situationId: curAccount.situationId,
    keyReminder: "",
    keyReminderExample: "",
    keyReminderPublicity: "",
}])
watchEffect(() => {
    if (props?.remindData?.length > 0) {
        remindList.value = props.remindData
    } else {
        remindList.value = [{
            matterId: curAccount.matterId,
            situationId: curAccount.situationId,
            keyReminder: "",
            keyReminderExample: "",
            keyReminderPublicity: "",
        }]
    }
})
//添加重点提醒
const addUlClick = () => {
    let obj = {
        matterId: curAccount.matterId,
        situationId: curAccount.situationId,
        keyReminder: "",
        keyReminderExample: "",
        keyReminderPublicity: "",
    }
    console.log('obj---', obj)
    remindList.value.push(obj)
}
//删除重点提醒
const deleteUlClick = (index: number) => {
    remindList.value?.splice(index, 1);
}
//公开性
const opennessOptions = [{
    value: "公示",
    label: '公示'
}, {
    value: "告知",
    label: '告知'
}, {
    value: "解释",
    label: '解释'
}]

defineExpose({
    remindList
})
</script>

<template>
    <div class="celated_issues">
        <ul class="list_ul" v-for="(item, index) in remindList" :key="index">
            <li>
                <el-input v-model="item.keyReminder" placeholder="重点提醒内容" />
            </li>
            <li>
                <el-input v-model="item.keyReminderExample" placeholder="重点提醒内容" />
            </li>
            <li>
                <el-select v-model="item.keyReminderPublicity" placeholder="请选择提醒方式">
                    <el-option v-for="item in opennessOptions" :key="item.value" :label="item.label"
                        :value="item.value"></el-option>
                </el-select>
            </li>
            <li class="delet_li" @click="deleteUlClick(index)">
                <span></span>
            </li>
        </ul>

        <div class="table_add" @click="addUlClick"> + 添加 </div>
    </div>
</template>



<style lang="less" scoped>
li.liw {
    flex-shrink: 0;
    width: 108px;
}

li .el-select {
    width: 100%;
}
</style>