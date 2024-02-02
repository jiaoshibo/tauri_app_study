<!-- 事项分流配置弹窗 -->
<script setup lang="ts">
import { ref, readonly } from 'vue';
import { ElMessage, ElLoading } from 'element-plus';
import type { FormInstance, FormRules, ElSelect } from 'element-plus';
import { CirclePlus, Remove } from '@element-plus/icons-vue';
import * as __axios_api_backBmgAssingRule from '@/axios/api/backBmgAssingRule';
import { selectCheckBoxSelect } from '@/axios/api/matterInfo';
import { getAllMatterByEnterHall } from '@/axios/api/taskCount';

// ============== 类型声明 👇 ====================

type ElSelectType = InstanceType<typeof ElSelect>;

interface RuleForm {
    ruleName: string;
    assignOrder: string;
    isRepeat: string;
    type: string;
    result: string;
    createdBy: string;
    id?:string;
}

interface SelectOptions extends Record<string,any> {
    value: any;
    label: string;
}


// =============== 类型声明 👆 ===================

const emits = defineEmits<{
    (e:'ok'):void
}>()

const ruleFormRef = ref<FormInstance>()

const dialogTitle = ref<string>('');
const dialogVisible = ref(false);

const status = ref<number>(1)


const saveLoading = ref(false)

const ruleForm = ref<RuleForm>({
    ruleName: "",
    assignOrder: "",
    isRepeat: "",
    type: "",
    result: "",
    createdBy: ""
})
const rules = ref<FormRules>({
    ruleName: [
        { required: true, message: '请输入', trigger: 'blur' }
    ],
    isRepeat: [
        { required: true, message: '请选择', trigger: 'change' }
    ],
    assignOrder: [
        { required: true, message: '请输入', trigger: 'blur' }
    ],
    type: [
        { required: true, message: '请选择类型', trigger: 'change' }
    ],
    result: [
        { required: true, message: '请输入结果', trigger: 'blur' }
    ]
})
const isRepeatOptions = ref<SelectOptions[]>([
    {
        value: 0,
        label: "否"
    }, {
        value: 1,
        label: "是"
    },
]);
const typeOptions = ref<SelectOptions[]>([{
    value: 1,
    label: "预约分流",
    dicCode:'FLWZ'
}, {
    value: 2,
    label: "委派分流",
    dicCode:'WPGZ'
},]);

/**
 * 分流类型下拉切换
 * @param val 
 */
const typeOptionsChange = (val:any)=>{
    console.log(val);
    ruleForm.value.ruleName = '';
    selectCheckBoxSelect(typeOptions.value.find(item=>item.value===val)?.dicCode).then(res=>{
        if(res.data.code===2001) ruleNameOptions.value = res.data.data
    })
}



/** 分流名称 */
const ruleNameOptions = ref<DictionaryObj[]>([])


const dialogTabel = ref<any[]>([
    {
        mainName: "",
        mainNameId: "",
        rule: "",
        nameList: [{
            name: "",
            ylgx: ""
        }],
        relyName: "",
        nameDataS: "",
        bracketsBegin: "",
        bracketsEnd: "",
    }
]);
const bracketsOptions = ref<SelectOptions[]>([
    {
        value: "[",
        label: "["
    }, {
        value: "]",
        label: "]"
    }
]);

const mianNameOptions = ref<any[]>([]);
const ruleOptions = ref<any[]>([
    {
        value: "<",
        label: "<"
    }, {
        value: ">",
        label: ">"
    }, {
        value: "=",
        label: "="
    }, {
        value: "<=",
        label: "<="
    }, {
        value: ">=",
        label: ">="
    }, {
        value: "!=",
        label: "!="
    }, {
        value: "^=",
        label: "^="
    }
]);
const nameOptions = ref<any[]>([
    {
        value: "1",
        label: "是"
    }, {
        value: "0",
        label: "否"
    }
]);
const relyNameOptions = ref<any[]>([
    {
        value: "&",
        label: "&"
    }, {
        value: "|",
        label: "|"
    }
]);

function childAddClick(index: number) {
    let obj = {
        name: "",
        ylgx: ""
    }
    dialogTabel.value[index].nameList.push(obj)
}
function childDeletClick(index: number, idx: number) {
    dialogTabel.value[index].nameList.splice(idx, 1)
}

// 需要获取字典的字段
const matchMainNameId:{id:string,code:string}[] = [
    { // 图纸审核方式
        id: 'drawingReviewMethod',
        code: 'SHFS'
    },
    { //人工梳理办理形式
        id:'handleProcedures',
        code:'RGSLBLXS'
    },
    { // 业务类型
        id: 'businessTypeId',
        code: 'YWLX'
    },
    { // 预约号位
        id: 'inSystem',
        code: 'FLWZ'
    },
    { // 事项名称
        id:'matterName',
        code:'?'
    }
]

const dicOptons =ref<DictionaryObj[]>([]);
const showDicOptions = ref<boolean>(false);

/**　事项名称列表 */
const matterNameList = ref<{label:string;value:string}[]>([])

/**
 * 获取事项名称列表时的loading
 */
const getMatterNameListLoading = ref(false);

const mainNameChange: ElSelectType['onChange'] = (id, index) => {
    dialogTabel.value[index].mainName = mianNameOptions.value.find(item => item.id === id).name;
    dialogTabel.value[index].nameList = [{
        name: "",
        ylgx: ""
    }]
    let dicCode = matchMainNameId.find(item=>item.id===id);
    if(dicCode){
        if(dicCode.id==='matterName'){
            getMatterNameListLoading.value = true;
            getAllMatterByEnterHall().then(res=>{
                if(res.data.code===2001){
                    dicOptons.value = res.data.data.map(item=>{
                        return {
                            id:item.matterName,
                            name:item.matterName,
                            type:0,
                            content:item.matterName,
                            value:item.matterName
                        }
                    }) 
                }
            }).finally(()=>{
                getMatterNameListLoading.value = false;
            })
        }else{
            showDicOptions.value = true;
            selectCheckBoxSelect(dicCode.code).then(res=>{
                if(res.data.code===2001){
                    dicOptons.value = res.data.data;
                }
            })
        }
    }else{
        showDicOptions.value = false;
    }
}

function submitClick() {
    saveLoading.value = true;
    let data:Record<string,any> = {
        ruleName: ruleForm.value.ruleName,
        isRepeat: ruleForm.value.isRepeat,
        type: ruleForm.value.type,
        assignOrder: ruleForm.value.assignOrder,
        result: ruleForm.value.result,
        functionName: "",
        functionExpression: "",
        viewExpression: "",
        createdBy: ruleForm.value.createdBy,
        isDelete:0
    }

    dialogTabel.value.forEach(ele => {
        ele.nameList.forEach((item: any) => {
            if (ele.nameList.length > 1) {
                ele.nameDataS += `${item.name}${item.ylgx}`
            } else {
                ele.nameDataS = `${item.name}`
            }
        })

        if (dialogTabel.value.length > 1) {
            data.functionExpression += `${ele.bracketsBegin}(${ele.mainNameId} ${ele.rule} ${ele.nameDataS})${ele.bracketsEnd} ${ele.relyName}`
            data.viewExpression += `${ele.bracketsBegin}(${ele.mainName} ${ele.rule} ${ele.nameDataS})${ele.bracketsEnd} ${ele.relyName}`
        } else {
            data.functionExpression += `${ele.bracketsBegin}(${ele.mainNameId} ${ele.rule} ${ele.nameDataS})${ele.bracketsEnd} `
            data.viewExpression += `${ele.bracketsBegin}(${ele.mainName} ${ele.rule} ${ele.nameDataS})${ele.bracketsEnd} `
        }
    })

    // data.funcList = dialogTabel.value;

    ruleFormRef.value?.validate(valid => {
        if (!valid) {
            ElMessage.warning("请输入信息");
            saveLoading.value = false;
        }else{
            status.value === 1 ? addList(data) : editList(data)
        }
    })

}

/**
 * 获取规则名称
 */
function getMainNameOptions(){
    __axios_api_backBmgAssingRule.queryAllDict().then(res=>{
        if(res.data.code===2001){
            mianNameOptions.value = res.data.data;
        }
    })
}

function addList(data: any) {
    __axios_api_backBmgAssingRule.backBmgAssignRule(data,'axiosPost').then(res=>{
        if(res.data.code===2001){
            if(res.data.data){
                ElMessage.success('新建成功');
                dialogVisible.value = false;
                emits('ok');
            }else{
                ElMessage.error('新建失败');
            }
        }else{
            ElMessage.error('新建失败');
        }
    }).finally(()=>{
        saveLoading.value = false;
    })
}

function editList(data: any) {
    data.id = ruleForm.value.id;
    __axios_api_backBmgAssingRule.backBmgAssignRule(data,'axiosPut').then(res=>{
        if (res.data.code === 2001) {
            if(res.data.data){
                ElMessage.success('修改成功');
                dialogVisible.value = false;
                emits('ok');
            }else{
                ElMessage.error('修改失败');
            }
        } else {
            ElMessage.error('修改失败');
        }
    }).finally(()=>{
        saveLoading.value = false;
    })
}

function AddClick() {
    let obj = {
        mainName: "",
        mainNameId: "",
        rule: "",
        nameList: [{
            name: "",
            ylgx: ""
        }],
        relyName: "",
        nameDataS: "",
        bracketsBegin: "",
        bracketsEnd: "",
    }

    dialogTabel.value.push(obj);
}

function DeletClick(index: number) {
    dialogTabel.value.splice(index, 1)
}


function handleClose() {
    status.value = 1;
    ruleForm.value.ruleName = "";
    ruleForm.value.assignOrder = "";
    ruleForm.value.isRepeat = "";
    ruleForm.value.type = "";
    ruleForm.value.type = "";
    ruleForm.value.createdBy = "";
    ruleForm.value.result = "";
    ruleForm.value.id = undefined;
    dialogTabel.value = [{
        mainName: "",
        mainNameId: "",
        rule: "",
        nameList: [{
            name: "",
            ylgx: ""
        }],
        relyName: "",
        nameDataS: "",
        bracketsBegin: "",
        bracketsEnd: "",
    }]
}

function handleClosed(){
    ruleFormRef.value?.clearValidate();

}

function closeDialog(){
    dialogVisible.value = false;
}

function openDialog(title: string) {
    dialogTitle.value = title;
    dialogVisible.value = true;
    getMainNameOptions();
}


/**
 * 打开新增弹窗
 */
function addClick(){
    openDialog('新增')
}

/**
 * 打开编辑弹窗
 * @param id 
 */
function editClick(id:string){
    openDialog('编辑');
    getListInfo(id);
    status.value = 2;
}

function getListInfo(id:string){
    __axios_api_backBmgAssingRule.backBmgAssignRule(id,'axiosGet').then(res=>{
        if(res.data.code===2001){
            ruleForm.value.type = res.data.data.type;
            typeOptionsChange(ruleForm.value.type);
            ruleForm.value.ruleName = res.data.data.ruleName;
            ruleForm.value.isRepeat = res.data.data.isRepeat;
            ruleForm.value.assignOrder = res.data.data.assignOrder;
            ruleForm.value.createdBy = res.data.data.createdBy;
            ruleForm.value.result = res.data.data.result;
            ruleForm.value.id = res.data.data.id;
            const viewResult = res.data.data.viewResult;

            if (viewResult.length > 0) {
                dialogTabel.value = [];
                viewResult.forEach((ele:any) => {
                    let obj = {
                        mainName: "",
                        mainNameId: "",
                        rule: "",
                        nameList: [] as any[],
                        relyName: "",
                        nameDataS: "",
                        bracketsBegin: "",
                        bracketsEnd: "",
                    }
                    obj.mainName = ele.name;
                    obj.mainNameId = ele.id;
                    obj.rule = ele.operator;
                    obj.bracketsBegin = ele.bracketsBegin;
                    obj.bracketsEnd = ele.bracketsEnd;
                    obj.relyName = ele.expressionOperator ? ele.expressionOperator : "";
                    if (ele.fieldArray.length > 0) {
                        obj.nameList = [];
                        ele.fieldArray.forEach((item:any) => {
                            let cObj = {
                                name: "",
                                ylgx: ""
                            }
                            cObj.name = item.value;
                            cObj.ylgx = item.operator ? item.operator : "";
                            obj.nameList.push(cObj)
                        })
                    }
                    dialogTabel.value.push(obj)
                })
            }
        }
    })
}

defineExpose({
    addClick,
    editClick
})

</script>

<template>
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="80%" :draggable="true" :destroy-on-close="false" :close-on-click-modal="false" :close-on-press-escape="false" @close="handleClose" @closed="handleClosed">
        <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="110px" class="demo-ruleForm">
            <el-form-item label="分流类型" prop="type">
                <el-select v-model="ruleForm.type" placeholder="请选择类型" clearable @change="typeOptionsChange">
                    <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="分流名称" prop="ruleName">
                <el-select v-model="ruleForm.ruleName" placeholder="请先选择分流类型" clearable>
                    <el-option v-for="item in ruleNameOptions" :key="item.value" :value="item.value" :label="item.content"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="是否高频事项" prop="isRepeat">
                <el-select v-model="ruleForm.isRepeat" placeholder="是否高频事项" clearable>
                    <el-option v-for="item in isRepeatOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            
            <el-form-item label="匹配优先级" prop="assignOrder">
                <el-input v-model="ruleForm.assignOrder" placeholder="请输入" type="number" clearable></el-input>
            </el-form-item>
            <!-- <el-form-item label="备注">
                <el-input v-model="ruleForm.result" placeholder="请输入"></el-input>
            </el-form-item> -->
            <el-form-item label="函数名称">
                <!-- <span>👇</span> -->
                <el-table v-loading="getMatterNameListLoading" :data="dialogTabel" border>
                    <el-table-column label="符号" align="center" width="120">
                        <template #default="scope">
                            <el-select v-model="scope.row.bracketsBegin" placeholder="请选择" clearable>
                                <el-option v-for="(item, index) in bracketsOptions" :key="index" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <!-- <span>{{ scope.row.bracketsBegin }}</span> -->
                        </template>
                    </el-table-column>
                    <el-table-column label="字段名称" align="center">
                        <template #default="scope">
                            <el-select v-model="scope.row.mainNameId" placeholder="请选择" clearable
                                @change="(id:any)=>{ mainNameChange(id, scope.$index) }">
                                <el-option v-for="item in mianNameOptions" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="规则配置" align=center>
                        <template #default="scope">
                            <el-select v-model="scope.row.rule" placeholder="请选择" clearable>
                                <el-option v-for="item in ruleOptions" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="字段名称" align="center">
                        <template #default="scope">
                            <div class="table_inputs" v-for="(item, idx) in scope.row.nameList" :key="idx">
                                <el-select v-model="item.name" placeholder="请选择" v-if="scope.row.mainName.includes('是否')" clearable>
                                    <el-option v-for="item in nameOptions" :key="item.value" :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>

                                <el-input placeholder="请输入" v-model="item.name" type="number" v-else-if="scope.row.mainName.includes('数量')" clearable></el-input>

                                <!-- <el-select-v2 v-else-if="scope.row.mainNameId==='matterName'" v-model="item.name" :options="matterNameList" placeholder="请选择"></el-select-v2> -->

                                <!-- 字典 👇 -->
                                <el-select v-else filterable placeholder="请选择" v-model="item.name" clearable>
                                    <el-option v-for="item in dicOptons" :key="item.value" :label="item.content" :value="item.content"></el-option>
                                </el-select>
                                <!-- 字典 👆 -->
                                <div class="table_select_btn">
                                    <el-icon @click="childAddClick(scope.$index)">
                                        <CirclePlus />
                                    </el-icon>
                                    <el-icon v-if="scope.row.nameList.length > 1" @click="childDeletClick(scope.$index, idx)">
                                        <Remove />
                                    </el-icon>
                                </div>
                                <el-select clearable v-model="item.ylgx" placeholder="依赖字段"
                                    v-if="idx + 1 != scope.row.nameList.length">
                                    <el-option v-for="item in relyNameOptions" :key="item.value" :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="符号" align="center" width="120">
                        <template #default="scope">
                            <el-select v-model="scope.row.bracketsEnd" placeholder="请选择" clearable>
                                <el-option v-for="(item, index) in bracketsOptions" :key="index" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <!-- <span>{{ scope.row.bracketsEnd }}</span> -->
                        </template>
                    </el-table-column>
                    <el-table-column label="依赖字段" align="center">
                        <template #default="scope">
                            <el-select clearable v-model="scope.row.relyName" placeholder="请选择"
                                v-if="scope.$index + 1 != dialogTabel.length">
                                <el-option v-for="item in relyNameOptions" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="155" align="center">
                        <template #default="scope">
                            <el-config-provider :button="{autoInsertSpace:false}">
                                <el-button type="primary" :text="true" @click="AddClick()">增加</el-button>
                                <el-button type="danger" :text="true" @click="DeletClick(scope.$index)" v-if="dialogTabel.length > 1">删除</el-button>
                            </el-config-provider>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
        </el-form>
        
        <template #footer>
            <span>
                <el-button @click="closeDialog">取 消</el-button>
                <el-button type="primary" :loading="saveLoading" @click="submitClick">保 存</el-button>
            </span>
        </template>
    </el-dialog>
</template>
  
<style lang="less" scoped>
.table_inputs {
    position: relative;

    .el-input,
    .el-select {
        width: 166px;
        margin-bottom: 10px;
    }
}

// .table_select {
//     position: relative;
// }

.table_select_btn {
    position: absolute;
    right: -4px;
    top: 5px;
    font-size: 20px;
    color: #df4b4b;

    i {
        margin-left: 6px;
        cursor: pointer;
    }
}

.el-select {
    width: 100%;
}</style>
