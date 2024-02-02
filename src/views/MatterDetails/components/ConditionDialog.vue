<!--
 * @Author: jiaxiaorong jiaxiaorong@syngo.net
 * @Date: 2023-10-24 17:23:23
 * @LastEditors: jiaxiaorong jiaxiaorong@syngo.net
 * @LastEditTime: 2023-10-26 11:32:32
 * @FilePath: \syngo-yckt-matter-library-web\src\views\MatterDetails\components\ConditionDialog.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup lang="ts">
import { ref, nextTick } from 'vue'
import eventMaterialsCom from './eventMaterialsCom.vue'

const dialogVisible = ref<boolean>(false)

const handleClose = () => {
    eventMaterialsComRef.value?.clearDiversionPositionFormValidator();
}
const openDialog = (type: number, matterId: string = "", situationName: string = "", id: string = "") => {
    dialogVisible.value = true;
    if (type === 1) {
        dialogTitle.value = "添加情形"
    } else {
        dialogTitle.value = "编辑情形"
    }
    setTimeout(()=> {
        eventMaterialsComRef.value?.openDialogType(type, matterId, situationName, id)
    },500)
}
const dialogTitle = ref<string>("添加情形")
// 子组件默认包含是私有
defineExpose({
    openDialog,
    handleClose
})

//ref
const eventMaterialsComRef = ref<InstanceType<typeof eventMaterialsCom>>()



//保存情形
const onSubmit = async ($parent: any) => {
    let result = await eventMaterialsComRef.value?.onSubmitSituation();
    if(result){
        dialogVisible.value = false;
        setTimeout(() => {
            $parent.taskBasicInfo()
        }, 500)
    }
}


const onCancel = ()=>{
    eventMaterialsComRef.value?.clearDiversionPositionFormValidator();
    dialogVisible.value = false;
}

</script>

<template>
    <el-dialog v-model="dialogVisible" width="80%" :close-on-click-modal="false" :close-on-press-escape="false" @closed="handleClose">
        <template #header>
            <div class="dialog-title--global">
                {{ dialogTitle }}
            </div>
        </template>
        <eventMaterialsCom ref="eventMaterialsComRef" :is-show="true"></eventMaterialsCom>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="onCancel">取消</el-button>
                <el-button type="primary" @click="onSubmit($parent)">保存</el-button>
            </span>
        </template>
    </el-dialog>
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
</style>