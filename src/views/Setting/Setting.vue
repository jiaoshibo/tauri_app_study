<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import ListPageLayout from '@/components/ListPageLayout.vue';

const saveLoading =  ref(false);
const saveForm = ref(localStorage.getItem('notify')??"");
function saveSetting(){
    saveLoading.value = true;
    // 保存设置
    if(saveForm.value){
        localStorage.setItem('notify',saveForm.value);
        ElMessage.success("保存成功");
    }else{
        ElMessage.error("请选择通知形式");
    }
    // 保存成功
    saveLoading.value = false;
}
</script>

<template>
    <ListPageLayout :breadcrumb-item="['事项管理', '设置']">
        <template #tableContent>
            <div class="tableContent current-content">
                <div class="dialog-title--global">
                    基本设置
                </div>
                <div style="margin-top: 18px;">
                    <el-form>
                        <el-form-item label="通知形式">
                            <el-select v-model="saveForm" placeholder="请选择">
                                <el-option value="接口"></el-option>
                                <el-option value="通知"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="buttons">
                    <el-button :loading="saveLoading" type="primary" @click="saveSetting">保存</el-button>
                </div>
            </div>
        </template>
    </ListPageLayout>
</template>

<style scoped lang="less">

.current-content {
    height: calc(100vh - 125px ) !important;
    margin-top: 0 !important;
    padding-right: 65px;
    display: flex;
    flex-direction: column;
}


.buttons{
    text-align: right;
    margin-top: auto;
}
</style>