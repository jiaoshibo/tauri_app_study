<!-- 非公服事项的编辑和查询 -->
<script setup lang="ts">
import { ref,reactive, onBeforeMount, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ListPageLayout from '@/components/ListPageLayout.vue';
import { selectCheckBoxSelect } from '@/axios/api/matterInfo';
import { ElMessage } from 'element-plus';
import { setterInfo, updSetterInfo } from '@/axios/api/taskCount';

const readonly = ref(false)
onBeforeMount(()=>{
    getSelect();
    getDetail(route.params.id as string);
    readonly.value = route.params.pageType === 'view'
})

const route = useRoute();
const router = useRouter();

/**
 * 获取详情
 */
function getDetail(id:string){
    setterInfo(id).then(res=>{
        if(res.data.code===2001){
            editForm.value = {
                id:res.data.data.id,
                matterName:res.data.data.matterName,
                workType:res.data.data.workType,
                matterFloor:res.data.data.matterFloor,
                matterArea:res.data.data.matterArea,
                substitutePersonnel:res.data.data.substitutePersonnel,
                chiefRepresentative:res.data.data.chiefRepresentative,
                matterTeacherName:res.data.data.matterTeacherName,
                matterTeacherJob:res.data.data.matterTeacherJob,
                departmentLeaders:res.data.data.departmentLeaders
            }

            console.log('editForm:::',editForm.value);
            
        }
    }).catch(e=>{
        console.error('getSyncMatter:::',e);
        ElMessage.error('服务器错误')
    })

}



interface SelectOptions<T> {
    tosOptions:T;
    matterFloorOptions:T;
    matterAreaOptions:T;
}

/**
 * 枚举下拉框
 */
const selectOptions = reactive<SelectOptions<DictionaryObj[]>>({
    tosOptions:[],matterFloorOptions:[],matterAreaOptions:[]
})

/**
 * 获取下拉框数据
 * @param dic 
 */
function getSelect(){
    const allPromise = Promise.all([selectCheckBoxSelect('YWLX'),selectCheckBoxSelect('SZLC'),selectCheckBoxSelect('SZQY')])

    allPromise.then(resList=>{
        if(resList[0].data.code===2001){
            selectOptions.tosOptions = resList[0].data.data;
        }
        if(resList[1].data.code===2001){
            selectOptions.matterFloorOptions = resList[1].data.data;
        }
        if(resList[2].data.code===2001){
            selectOptions.matterAreaOptions = resList[2].data.data;
        }
    })
}

/**
 * 非公服事项详情信息
 */
const editForm = ref<Partial<TaskCount.SetterInfoObject>>({})

/**
 * 回显楼层
 */
const matterFloorName = computed(()=>{
    return selectOptions.matterFloorOptions.find(item=>item.value===editForm.value.matterFloor)?.content
})

/**
 * 回显区域
 */
const matterAreaName = computed(()=>{
    return selectOptions.matterAreaOptions.find(item=>item.value===editForm.value.matterArea)?.content
})

/**
 * 回显业务类型
 */
const workTypeName = computed(()=>{
    return selectOptions.tosOptions.find(item=>item.value=== editForm.value.workType)?.content
})

/**
 * 是否有进厅信息
 */
const innerInfoFlag = computed(()=>{
    return Boolean(editForm.value.matterTeacherName || editForm.value.matterTeacherJob || editForm.value.departmentLeaders || editForm.value.chiefRepresentative || editForm.value.substitutePersonnel);
})

function onGoBack(){
    router.back();
}

const saveLoading = ref(false)

function onSave(){
    saveLoading.value = true;
    updSetterInfo(editForm.value).then(res=>{
        if(res.data.code===2001){
            if(res.data.data===1){
                ElMessage.success('保存成功');
                router.back();
            }else{
                ElMessage.error('保存失败');
            }
        }
    }).finally(()=>{
        saveLoading.value = false;
    })
}

</script>

<template>
    <ListPageLayout :breadcrumb-item="['事项管理','非公服事项管理', readonly?'查看事项':'编辑事项']">
        <template #tableContent>
            <div class="tableContent current-content">
                <div class="dialog-title--global">
                    基本信息
                </div>
                <div style="margin-top: 18px;">
                    <el-form label-width="100px" :model="editForm">
                        <!-- <el-form-item label="提供延时服务">
                            <el-radio-group>
                                <el-radio label="是"></el-radio>
                                <el-radio label="否"></el-radio>
                            </el-radio-group>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <el-checkbox-group>
                                <el-checkbox label="工作日延时 服务时段：8:30-9:00；12:00-13:30；17:00-17:30"></el-checkbox>
                                <el-checkbox label="周末延时 服务时段：9:00-13:00"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item> -->
                        <el-row>
                            <el-col :md="12" :sm="24">
                                <el-form-item label="事项名称">
                                    <span v-if="readonly">{{ editForm.matterName }}</span>
                                    <el-input v-else placeholder="请输入" v-model="editForm.matterName" clearable></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :md="12" :sm="24">
                                <el-form-item label="业务类型">
                                    <span v-if="readonly">{{ workTypeName }}</span>
                                    <el-select v-else placeholder="请选择" v-model="editForm.workType" style="width:100%" clearable>
                                        <el-option v-for="item in selectOptions.tosOptions" :key="item.value" :value="item.value" :label="item.content"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :md="12" :sm="24">
                                <el-form-item label="所在楼层">
                                    <span v-if="readonly">{{ matterFloorName }}</span>
                                    <el-select v-else placeholder="请选择" v-model="editForm.matterFloor" style="width:100%" clearable>
                                        <el-option v-for="item in selectOptions.matterFloorOptions" :key="item.value" :value="item.value" :label="item.content"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :md="12" :sm="24">
                                <el-form-item label="所在区域">
                                    <span v-if="readonly">{{ matterAreaName }}</span>
                                    <el-select v-else placeholder="请选择" v-model="editForm.matterArea" style="width:100%" clearable>
                                        <el-option v-for="item in selectOptions.matterAreaOptions" :key="item.value" :value="item.value" :label="item.content"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>   
                </div>
                <template v-if="innerInfoFlag">
                    <div class="dialog-title--global">
                        进厅信息
                    </div>
                    <div style="margin-top: 18px;">
                        <el-form label-width="100px">
                            <el-row>
                                <el-col :lg="6" :md="8" :sm="24">
                                    <el-form-item label="事项负责老师">
                                        <span>{{ editForm.matterTeacherName }}</span>
                                    </el-form-item>
                                </el-col>
                                <el-col :lg="6" :md="8" :sm="24">
                                    <el-form-item label="负责老师岗位">
                                        <span>{{ editForm.matterTeacherJob }}</span>
                                    </el-form-item>
                                </el-col>
                                <el-col :lg="6" :md="8" :sm="24">
                                    <el-form-item label="处室领导">
                                        <span>{{ editForm.departmentLeaders }}</span>
                                    </el-form-item>
                                </el-col>
                                <el-col :lg="6" :md="8" :sm="24">
                                    <el-form-item label="首席代表">
                                        <span>{{ editForm.chiefRepresentative }}</span>
                                    </el-form-item>
                                </el-col>
                                <el-col :lg="6" :md="8" :sm="24">
                                    <el-form-item label="待岗人员姓名">
                                        <span>{{ editForm.substitutePersonnel }}</span>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>   
                    </div>
                </template>
                <div class="buttons">
                    <el-button @click="onGoBack">返回</el-button>
                    <el-button v-if="!readonly" :loading="saveLoading" type="primary" @click="onSave">保存</el-button>
                </div>
            </div>
        </template>
    </ListPageLayout>
</template>
  
<style scoped lang="less">
.buttons{
    text-align: right;
    margin-top: auto;
}

.current-content {
    height: calc(100vh - 125px ) !important;
    margin-top: 0 !important;
    padding-right: 65px;
    display: flex;
    flex-direction: column;
}
</style>
