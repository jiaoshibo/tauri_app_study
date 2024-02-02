<script setup lang="ts">
import { ref, nextTick } from "vue";
import { useRouter } from 'vue-router';
import { useDialogConfig } from "@/hooks/useDialogConfig";
import { ElMessage } from 'element-plus'
import type { UploadHooks, UploadFiles } from 'element-plus';
import { queryMatterCatSelect, queryMatterMaterial } from '@/axios/api/backBmgMatterCat';
import { Upload, Document } from '@element-plus/icons-vue';
import { generate } from '@/axios/api/situation';

// =========== 数据变量 👇 ============
const router = useRouter();


type DataList = {
    label:string;
    mes?:string;
    children?:DataList[]
}

const dataList = ref<DataList[]>([]);
const defaultProps = {
    children: 'children',
    label: 'label'
}
const id = ref('');
const matterCatName = ref("");
const matterName = ref('');
const matterSubitemName = ref('')
const matterMainName = ref('')
const matterMainId = ref('')
const matterSubId = ref('');
const dialogConfig = useDialogConfig();
const dialogWidth = ref("36%")
const orderList = ref<any[]>([]); //材料清单数据
const fileList = ref<UploadFiles>([]); //情形上传数据
const updateShow = ref(true);
const showDialogRight = ref(false);
const matterCatId = ref("")
const restaurantsList = ref<any[]>([]);
const itemsId = ref('');

// =========== 数据变量 👆 ============


function contentSet(val:any){
    getMatterCatSelect();
    itemsId.value = val.matterId;
    dialogConfig.visible = true;
    setTreeList(val);
    matterName.value = val.matterName;
    matterMainName.value = val.matterMainName;
    matterMainId.value = val.matterMainId;
    matterSubitemName.value = val.matterSubName;
    matterSubId.value = val.matterSubId;
    id.value = val.id;
}

// 获取列表
function getMatterCatSelect(){
    restaurantsList.value = [];
    queryMatterCatSelect().then(res=>{
        if (res.data.code == 2001) {
            if (res.data.data.length > 0) {
                res.data.data.forEach((ele:any) => {
                    let obj = {
                        id: ele.id,
                        value: ele.name
                    }
                    restaurantsList.value.push(obj);
                })
            }
        }
    })
}

// 根据事项id查询材料列表
function getMatterMaterial() {
    orderList.value = [];
    queryMatterMaterial(itemsId.value).then(res=>{
        if(res.data.code===2001){
            orderList.value = res.data.data;
        }
    })
}


function setTreeList(newList:any){
    dataList.value = []
    let obj = {  //树形图结构数据
        label: '事项大类',
        children: [{
            label: '事项主项',
            mes: newList.matterMainName,
            children: [{
                label: '事项子项',
                mes: newList.matterSubName,
                children: [{
                    label: '事项办理名称',
                    mes: newList.matterName,
                    children: [{
                        label: '事项情形',
                        mes: '请上传事项情形'
                    }]
                }]
            }]
        }]
    }
    dataList.value.push({
        label: '事项办理名称',
        mes: newList.matterName,
        children: [{
            label: '事项情形',
            mes: '请上传事项情形'
        }]
    })
}

const querySearch = (queryString: string, callback: (arg: any) => void) => {
    let restaurants = restaurantsList.value;
    let results = queryString ? restaurants.filter(createFilter(queryString)) : restaurants;
    callback(results)
}

function createFilter(queryString: string) {
    return (restaurant: any) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
    };
}

function handleSelect(item: any) {
    matterCatId.value = item.id
}

function showDialogRightClick() {
    getMatterMaterial();
    showDialogRight.value = !showDialogRight.value;
    dialogWidth.value = showDialogRight.value ? "60%" : "36%"
}


const handleChange: UploadHooks['onChange'] = (file, files) => {
    const fileSuffix = file.name.substring(file.name.lastIndexOf('.') + 1);
    const whiteList = ["xlsx"];
    if (whiteList.indexOf(fileSuffix) === -1) {
        ElMessage.warning('上传文件只支持excel格式')
        updateShow.value = false;
        nextTick(() => {
            updateShow.value = true;
        })
        return false;
    }
    fileList.value = files;
    console.log('fileList:::',fileList.value);
}

const removeUploadFile: UploadHooks['beforeRemove'] = (file, files) => {
    fileList.value = files;
    return true;
}


function removeFile(index: any, files: any) {
    fileList.value.splice(index, 1)
}


const uploadLoading = ref(false);

/**
 * 文件上传
 */
function uploadFile() {
    if(fileList.value.length===0){
        ElMessage.warning('请上传事项情形文件')
    }else{
        uploadLoading.value = true;
        generate(itemsId.value, {
            file: fileList.value[0].raw
        }).then(res => {
            if (res.data.code === 2001) {
                router.push({
                    path: '/matterDetails',
                    query: {
                        matterCatName: matterCatName.value,
                        matterCatId: matterCatId.value,
                        matterName: matterName.value,
                        matterSubId: matterSubId.value,
                        matterMainName: matterMainName.value,
                        matterMainId: matterMainId.value,
                        matterSubitemName: matterSubitemName.value,
                        matterSituationName: "",
                        situationId: "",
                        excelUrl: "",
                        matterId: itemsId.value,
                        type:'1',
                        id:id.value
                    }
                })
                sessionStorage.setItem('moduleList', JSON.stringify(res.data.data))
            }else{
                ElMessage.error(res.data.message)
            }
        }).finally(()=>{
            uploadLoading.value = false;
        })
    }
}

/**
 * 关闭弹窗重置所有预设变量
 */
function resetStatus(){
    orderList.value = [];
    showDialogRight.value = false;
    dialogWidth.value = '36%';
    id.value = '';
    matterCatName.value = '';
    matterName.value = '';
    matterSubitemName.value = '';
    matterMainName.value = '';
    matterMainId.value = '';
    matterSubId.value = '';
    fileList.value = [];
    updateShow.value = true;
    matterCatId.value = '';
    restaurantsList.value = [];
    itemsId.value = '';
}

function closeDialog() {
    dialogConfig.visible = false;
}
defineExpose({
    contentSet,
    closeDialog
})
</script>

<template>
    <el-dialog v-model="dialogConfig.visible" :close-on-click-modal="dialogConfig.closeOnClickModal"
        :draggable="dialogConfig.draggable" :close-on-press-escape="dialogConfig.closeOnClickModal" :width="dialogWidth" @closed="resetStatus">
        <template #header>
            <div class="dialog-title--global">情形配置</div>
        </template>
        <div class="dialogPato">
            <div class="left">
                <div class="content">
                    <el-tree :data="dataList" :props="defaultProps" :default-expand-all="true" :expand-on-click-node="false">
                        <template #default="{ node, data }">
                            <span class="custom-tree-node">
                                <span>{{ node.label }}&nbsp;</span>
                                <el-autocomplete class="inline-input inputClass" v-if="node.label == '事项大类'"
                                    v-model="matterCatName" :fetch-suggestions="querySearch" placeholder="请输入事项大类"
                                    @select.stop="handleSelect">
                                </el-autocomplete>
                                <span class="custom-tree-node-span">
                                    {{ data.mes }}
                                    <span v-if="node.label == '事项办理名称'" class="btnClass"
                                        @click.stop="showDialogRightClick">材料清单</span>
                                    <span v-if="node.label == '事项情形'" class="uploadClass">
                                        <el-upload class="upload-demo" action="#" :on-change="handleChange"
                                            v-if="updateShow" :file-list="fileList" :before-remove="removeUploadFile"
                                            :auto-upload="false" :limit="1">
                                            <el-button :icon="Upload"></el-button>
                                            <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                                        </el-upload>
                                    </span>
                                    <ul v-if="node.label == '事项情形'" class="ulList">
                                        <el-popconfirm title="文件操作" confirm-button-text="删除" cancel-button-text="取消" confirm-button-type="danger" cancel-button-type="default"  :icon="Document" placement="top"
                                            v-for="(item, index) in fileList" :key="item.uid + index"
                                            @confirm="removeFile(index, fileList)">
                                            <template #reference>
                                                <p :title="item.name" class="showPwen">
                                                    {{ item.name }}
                                                </p>
                                            </template>
                                        </el-popconfirm>
                                    </ul>
                                </span>
                            </span>

                        </template>
                    </el-tree>
                </div>
            </div>
            <div class="right" v-if="showDialogRight">
                <div class="rightTitle">材料名称</div>
                <div v-for="(item, index) in orderList" :key="item.id" class="dialogDiv">{{
                    (index + 1) + '、' +
                    item.name
                }}
                </div>
            </div>
        </div>
        <template #footer>
            <el-button type="primary" :loading="uploadLoading" @click="uploadFile">生 成</el-button>
            <el-button @click="closeDialog">取 消</el-button>
        </template> 
    </el-dialog>
</template>

<style scoped lang="less">
.matterOrderBox {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    width: 100%;
}

.header {
    display: flex;
    height: 8%;
    align-items: center;
    background-color: #fff;
    padding: 0 10px;
}

.pageFooter {
    margin-top: 10px;
}

.content {
    height: 88%;
}

.footer {
    height: 6%;
    text-align: center;
}

.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    font-size: 14px;
    padding-right: 8px;
}

/* 每个节点后面内容样式 */
.custom-tree-node-span {
    width: 180px;
    height: 30px;
    margin-left: 20px;
    text-align: left;
    line-height: 30px;
}

.inputClass {
    width: 240px;
    margin-left: 20px;
}

.btnClass {
    width: 120px;
    height: 30px;
    margin-left: 10px;
    line-height: 30px;
    text-align: center;
    // border: 1px solid #409eff;
    padding: 5px;
    color: #409eff;
    border-radius: 5px;
    i {
        margin-right: 5px;
        color: #409eff;
    }
}

.uploadClass {
    position: absolute;
    margin-left: 15px;
}

.dialogDiv {
    text-align: left;
    margin-bottom: 10px;
    font-size: 14px;
    line-height: 20px;
}

.ulList {
    position: absolute;
    margin-top: 10px;
    font-size: 14px;
}

.uploadBtn {
    width: 30px;
    height: 30px;
    border: 1px dotted #ccc;
    border-radius: 5px;
    background-color: #fff;
    color: #333;
    text-align: center;
    line-height: 30px;

    i {
        width: 15px;
        height: 15px;
    }
}

.showPwen {
    width: 300px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-wrap: break-word;
}

.dialogPato {
    display: flex;

    .left {
        width: 100%;
    }

    .right {
        height: 300px;
        overflow-y: auto;
        border-left: 1px solid #ccc;
        padding-left: 20px;
    }
}

.rightTitle {
    border-left: 8px solid #409eff;
    padding-left: 15px;
    font-size: 16px;
    margin-bottom: 20px;
    font-weight: 700;
}

:deep(.upload-demo) {
    height: 32px;
    overflow: hidden;
}

// /deep/.el-input__inner {
//     height: 28px;
//     margin-left: 20px;
// }

:deep(.el-tree-node__content) {
    height: 40px;
}

:deep(.el-dialog__body) {
    padding: 0 20px;
}

:deep(.el-dialog__footer) {
    text-align: center;
    margin-top: 60px;
    border-top: 1px solid #eee;
}
</style>