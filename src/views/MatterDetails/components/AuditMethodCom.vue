<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

interface Props {
    auditMethodList: AuditmethodObj
}
const props = defineProps<Props>()

const ruleFormRef = ref<FormInstance>()


const rules = reactive<FormRules<AuditmethodObj>>({
    drawingRequired: [
        { required: true, message: '请选择是否需要图纸', trigger: 'change' },
    ],
})

const drawingAuditOptions = [{
    value: "0",
    label: '实质审查'
}, {
    value: "1",
    label: '形式审查'
}]
const isMiddleMaterialOptions = [{
    value: "0",
    label: '否'
}, {
    value: "1",
    label: '是'
}]

</script>

<template>
    <div>
        <el-form ref="ruleFormRef" :model="auditMethodList" :rules="rules" label-width="200px" class="demo-ruleForm">
            <div class="form_item_flex">
                <el-form-item label="是否需要图纸：" prop="drawingRequired">
                    <el-radio-group v-model="auditMethodList.drawingRequired">
                        <el-radio label="1">是</el-radio>
                        <el-radio label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="图纸审核方式：">
                    <el-select v-model="auditMethodList.drawingReviewMethod" placeholder="选择图纸审核方式" :disabled="auditMethodList.drawingRequired=='0'">
                        <el-option v-for="item in drawingAuditOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </div>
            <div class="form_item_flex">
                <el-form-item label="材料审核方式：">
                    <el-select v-model="auditMethodList.materialReviewMethod" placeholder="选择材料审核方式" :disabled="auditMethodList.drawingRequired=='0'">
                        <el-option v-for="item in drawingAuditOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="材料是否需要中台审核：">
                    <el-select v-model="auditMethodList.isMiddleMaterial" placeholder="请选择">
                        <el-option v-for="item in isMiddleMaterialOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>

<style lang="less" scoped>
.demo-ruleForm {
    padding: 24px 24px 24px 0;
}

.form_item_flex {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

.form_item_flex .el-select {
    width: 100%;
}

:deep(.form_item_flex .el-form-item) {
    width: 40%;
}
</style>