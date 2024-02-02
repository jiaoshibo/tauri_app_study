<script setup lang="ts">
import { ref, reactive, watchEffect, inject } from 'vue'
import { ElMessage } from "element-plus";
import { getAllMatterSelector, getMatterAddr } from "@/axios/api/matterSituation";
import { getMaterialListByMatterId } from "@/axios/api/taskCount";
import { useRoute } from 'vue-router';
import {
    Document
} from '@element-plus/icons-vue'

interface Props {
    celatedIssuesData: MatterRelevantList[]
}
type idParams = {
    matterId: string,
    situationId: string,
}
let curAccount: idParams = inject('idParams') as idParams;
const route = useRoute();
const props = defineProps<Props>()
let relatedList = ref<MatterRelevantList[]>([{
    matterId: curAccount.matterId,
    situationId: curAccount.situationId,
    relevantMattersName: "",
    relevantMattersUnit: "",
    relevantMattersAddress: "",
}])
watchEffect(() => {
    if (props?.celatedIssuesData?.length > 0) {
        relatedList.value = props.celatedIssuesData
    } else {
        relatedList.value = [{
            matterId: curAccount.matterId,
            situationId: curAccount.situationId,
            relevantMattersName: "",
            relevantMattersUnit: "",
            relevantMattersAddress: "",
        }]
    }
})
//添加相关事项
const addUlClick = () => {
    let obj = {
        matterId: curAccount.matterId,
        situationId: curAccount.situationId,
        relevantMattersName: "",
        relevantMattersUnit: "",
        relevantMattersAddress: "",
    }
    console.log('obj---', obj)
    relatedList.value.push(obj)
}
//删除相关事项
const deleteUlClick = (index: number) => {
    relatedList.value?.splice(index, 1);
}
//相关事项
const correlationMatterOptions = ref<CorrelationList[]>([])

//相关材料清单
let eventMaterialList = ref<TaskCount.GetMaterialListByMatterIdObj[]>([])
//相关事项分页
type queryType = {
    page: number,
    limit: number,
}
let query = ref<queryType>({
    page: 1,
    limit: 15,
})
//获取相关事项
function onGetAllMatterSelector() {
    const { page, limit } = query.value;
    getAllMatterSelector(page, limit).then(res => {
        let resData = res.data;
        if (resData.code === 2001) {
            let correlationMatterList = resData.data.list.filter(ele => ele);
            correlationMatterOptions.value.push(...correlationMatterList)
        } else {
            ElMessage.error(resData.message)
        }
    }).catch(() => {
        ElMessage.error('服务器错误')
    }).finally(() => {
        // tableLoading.value = false;
    })
}
//获取相关事项
function onGetMatterAddr(name: string, index: number) {
    let id = correlationMatterOptions.value.find(item=>item.name===name)?.id as string;
    getMatterAddr(id).then(res => {
        let resData = res.data;
        if (resData.code === 2001) {
            relatedList.value[index].relevantMattersUnit = resData.data.name;
            relatedList.value[index].relevantMattersAddress = resData.data.extraStr;
        } else {
            ElMessage.error(resData.message)
        }
    }).catch(() => {
        ElMessage.error('服务器错误')
    }).finally(() => {
        // tableLoading.value = false;
    })
}
//根据事项id获取相关材料
function onGetMaterialListByMatterId(name: string) {
    let id = correlationMatterOptions.value.find(item=>item.name===name)?.id;
    if(!id) {
        ElMessage.warning("请先选择相关事项！")
        return
    }
    dialogVisible.value = true
    getMaterialListByMatterId(id).then(res => {
        let resData = res.data;
        if (resData.code === 2001) {
            eventMaterialList.value = resData.data;
        } else {
            ElMessage.error(resData.message)
        }
    }).catch(() => {
        ElMessage.error('服务器错误')
    }).finally(() => {
        // tableLoading.value = false;
    })
}
//dom 事件节点
const dom = ref()
const loadMore = () => {
    console.log('loadMore-----------')
}
const dialogVisible = ref(false)
const handleClose = () => {
    dialogVisible.value = false
    eventMaterialList.value = []
}
/* 滚动监听函数 */
const scrollAddEventFn = (e: any) => {
    const self = e.target as any
    if (self.scrollHeight - self.scrollTop - 0.8 <= self.clientHeight) {
        console.log('分页查询')
        console.log(query.value.page++)
        query.value.page++
        onGetAllMatterSelector()
    }
}
const visibleChange = (isShow: any) => {
    if (isShow) {
        const parentDom = document.querySelectorAll(
            '.el-select-dropdown__wrap.el-scrollbar__wrap.el-scrollbar__wrap--hidden-default'
        ) as any
        setTimeout(() => {
            parentDom.forEach((e: any, idx: number) => {
                if (
                    e.querySelector('.LabelSelectCpmBox') &&
                    e.querySelector('.LabelSelectCpmBox').children &&
                    e.querySelector('.LabelSelectCpmBox').children.length >
                    0
                ) {
                    dom.value = parentDom[idx]
                    dom.value.addEventListener(
                        'scroll',
                        scrollAddEventFn,
                        false
                    )
                }
            })
        }, 1000)
    } else {
        // 移除滚动监听
        dom.value?.removeEventListener('scroll', scrollAddEventFn, false)

    }
}
defineExpose({
    onGetAllMatterSelector,
    correlationMatterOptions,
    relatedList
})
</script>

<template>
    <div class="celated_issues">
        <ul class="list_ul" v-for="(item, index) in relatedList" :key="index">
            <li class="LabelSelectCpm">
                <el-select @visible-change="visibleChange" v-model="item.relevantMattersName" placeholder="请选择相关事项"
                    @change="(val:any) => onGetMatterAddr(val, index)">
                    <div class="LabelSelectCpmBox">
                        <el-option v-for="item in correlationMatterOptions" :key="item.id" :label="item.name"
                            :value="item.name"></el-option>
                    </div>
                </el-select>
            </li>
            <li>
                <el-input v-model="item.relevantMattersUnit" placeholder="相关事项办理单位关联" disabled
                    :title="item.relevantMattersUnit" />
            </li>
            <li>
                <el-input v-model="item.relevantMattersAddress" placeholder="相关事项办理地址关联" disabled
                    :title="item.relevantMattersAddress" />
            </li>
            <li class="liw">
                <el-button :icon="Document" @click="onGetMaterialListByMatterId(item.relevantMattersName)">查看清单</el-button>
            </li>
            <li class="delet_li" @click="deleteUlClick(index)">
                <span></span>
            </li>
        </ul>
        <div class="table_add" @click="addUlClick"> + 添加 </div>
    </div>
    <!-- 查看材料 -->
    <el-dialog v-model="dialogVisible" width="30%" :before-close="handleClose">
        <template #header>
            <div class="dialog-title--global">
                相关事项材料清单
            </div>
        </template>
        <ul class="matter_ul">
            <li v-for="(item, index) in eventMaterialList" :key="index">{{ item.name }}</li>
        </ul>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </template>
    </el-dialog>
</template>



<style lang="less" scoped>
li.liw {
    flex-shrink: 0;
    width: 108px;
}

li .el-select {
    width: 100%;
}
.matter_ul {
    padding: 0 20px;
    height: 400px;
    overflow: auto;

    li {
        padding-bottom: 16px;
    }
}
</style>