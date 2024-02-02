<!-- 版本对比 -->
<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import ListPageLayout from '@/components/ListPageLayout.vue';
import { compareSyncMatter } from '@/axios/api/taskCount';

onBeforeMount(()=>{
    getCompareSyncMatter();
})

const router = useRouter();
const route = useRoute();

const sourceForm = ref<Record<string,any>>({});
const targetForm = ref<Record<string,any>>({});

const sourceTable = ref<any>([]);
const targetTable = ref<any>([]);

function getCompareSyncMatter(){
    compareSyncMatter({
        taskCode:route.query.taskCode as string,
        taskGuid:route.query.taskGuid as string,
        taskType:route.query.taskType as string,
        cdBatchArr: route.query.cdBatchArr as string[]
    }).then(res=>{
        if(res.data.code===2001){
            sourceForm.value = res.data.data.source;
            targetForm.value = res.data.data.target;
            res.data.data.source.materialsList.diffArr?.forEach((item:any)=>{
                sourceTable.value.push(item.source)
            })
            res.data.data.target.materialsList.diffArr?.forEach((item:any)=>{
                targetTable.value.push(item.target);
            })
        }
    })
}

/**
 * 设置元素高度
 * @param beSetElementClass 对比信息行class
 * @param sourceFormElementClass 当前版本行class
 * @param targetFormElementClass 目标版本行class
 */
function setDivHeight (beSetElementClass:string, sourceFormElementClass: string, targetFormElementClass: string){
    const beset = document.querySelector(beSetElementClass) as HTMLElement;
    const source = document.querySelector(sourceFormElementClass) as HTMLElement;
    const target = document.querySelector(targetFormElementClass) as HTMLElement;
    let sourceHeight: string = window.getComputedStyle(source).height.replace('px','');
    let targetHeight: string = window.getComputedStyle(target).height.replace('px','');
    let numberOfSourceHeight = Number(sourceHeight);
    let numberOfTargetHeight = Number(targetHeight)
    if(numberOfSourceHeight >= numberOfTargetHeight){
        beset.style.height = sourceHeight + 'px';
        target.style.height = sourceHeight + 'px';
    }else{
        beset.style.height = targetHeight + 'px';
        source.style.height = targetHeight + 'px';
    }
}

/**
 * 修改按钮
 */
function onModify(){
    // router.push({path:'/versionModification'})
    router.push({
        path: "/matterDetails",
        query: {type: '2',...route.query}
    })
}

</script>

<template>
    <ListPageLayout :breadcrumb-item="['事项管理','事项异动','版本对比']">
        <template #tableContent>
            <div class="tableContent" style="margin-top: 0;height:auto">
                <div class="dialog-title--global current-page-title">
                    对比结果
                    <el-button class="modifyButton" type="primary" @click="onModify">修改</el-button>
                </div>
                <div class="compar-info">
                    <table class="compar-info-table">
                        <thead>
                            <tr class="compar-info-table-head">
                                <th class="compar-info-table-th-0">对比结果</th>
                                <th class="compar-info-table-th-1">{{ '版本' + (sourceForm.taskversion as string)?.replace(/<.*?>/g, '') }}</th>
                                <th class="compar-info-table-th-2">{{ '版本' + (targetForm.taskversion as string)?.replace(/<.*?>/g, '') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>事项名称</td>
                                <td title="事项名称" v-html="sourceForm.taskName"></td>
                                <td title="事项名称" v-html="targetForm.taskName"></td>
                            </tr>
                            <tr>
                                <td>事项状态</td>
                                <td title="事项状态" v-html="sourceForm.taskstate"></td>
                                <td title="事项状态" v-html="targetForm.taskstate"></td>
                            </tr>
                            <tr>
                                <td>基本编码</td>
                                <td title="基本编码" v-html="sourceForm.catalogcode"></td>
                                <td title="基本编码" v-html="targetForm.catalogcode"></td>
                            </tr>
                            <tr>
                                <td>实施编码</td>
                                <td title="实施编码" v-html="sourceForm.taskcode"></td>
                                <td title="实施编码" v-html="targetForm.taskcode"></td>
                            </tr>
                            <tr>
                                <td>事项类型</td>
                                <td title="事项类型" v-html="sourceForm.tasktype"></td>
                                <td title="事项类型" v-html="targetForm.tasktype"></td>
                            </tr>
                            <tr>
                                <td>行使层级</td>
                                <td title="行使层级" v-html="sourceForm.uselevel"></td>
                                <td title="行使层级" v-html="targetForm.uselevel"></td>
                            </tr>
                            <tr>
                                <td>版本时间</td>
                                <td title="版本时间" v-html="sourceForm.cdTime"></td>
                                <td title="版本时间" v-html="targetForm.cdTime"></td>
                            </tr>
                            <tr>
                                <td>批次号</td>
                                <td title="批次号" v-html="sourceForm.cdBatch"></td>
                                <td title="批次号" v-html="targetForm.cdBatch"></td>
                            </tr>
                            <tr>
                                <td>实施主体</td>
                                <td title="实施主体" v-html="sourceForm.deptname"></td>
                                <td title="实施主体" v-html="targetForm.deptname"></td>
                            </tr>
                            <tr>
                                <td>实施主体编码</td>
                                <td title="实施主体编码" v-html="sourceForm.deptcode"></td>
                                <td title="实施主体编码" v-html="targetForm.deptcode"></td>
                            </tr>
                            <tr>
                                <td>实施主体性质</td>
                                <td title="实施主体性质" v-html="sourceForm.depttype"></td>
                                <td title="实施主体性质" v-html="targetForm.depttype"></td>
                            </tr>
                            <tr>
                                <td>法律依据</td>
                                <td title="法律依据" v-html="sourceForm.byLaw"></td>
                                <td title="法律依据" v-html="targetForm.byLaw"></td>
                            </tr>
                            <tr>
                                <td>权力来源</td>
                                <td title="权力来源" v-html="sourceForm.powersource"></td>
                                <td title="权力来源" v-html="targetForm.powersource"></td>
                            </tr>
                            <tr>
                                <td>法定办结时限</td>
                                <td title="法定办结时限" v-html="sourceForm.anticipateday"></td>
                                <td title="法定办结时限" v-html="targetForm.anticipateday"></td>
                            </tr>
                            <tr>
                                <td>法定办结时限单位</td>
                                <td title="法定办结时限单位" v-html="sourceForm.anticipatetype"></td>
                                <td title="法定办结时限单位" v-html="targetForm.anticipatetype"></td>
                            </tr>
                            <tr>
                                <td>承诺办结时限</td>
                                <td title="承诺办结时限" v-html="sourceForm.promiseday"></td>
                                <td title="承诺办结时限" v-html="targetForm.promiseday"></td>
                            </tr>
                            <tr>
                                <td>承诺办结时限单位</td>
                                <td title="承诺办结时限单位" v-html="sourceForm.promisetype"></td>
                                <td title="承诺办结时限单位" v-html="targetForm.promisetype"></td>
                            </tr>
                            <tr>
                                <td>承诺办结时限说明</td>
                                <td title="承诺办结时限说明" v-html="sourceForm.promiseexplain"></td>
                                <td title="承诺办结时限说明" v-html="targetForm.promiseexplain"></td>
                            </tr>
                            <tr>
                                <td>是否收费</td>
                                <td title="是否收费" v-html="sourceForm.isfee"></td>
                                <td title="是否收费" v-html="targetForm.isfee"></td>
                            </tr>
                            <tr>
                                <td>收费依据</td>
                                <td title="收费依据" v-html="sourceForm.feebasis"></td>
                                <td title="收费依据" v-html="targetForm.feebasis"></td>
                            </tr>
                            <tr>
                                <td>办件类型</td>
                                <td title="办件类型" v-html="sourceForm.projecttype"></td>
                                <td title="办件类型" v-html="targetForm.projecttype"></td>
                            </tr>
                            <tr>
                                <td>办理形式</td>
                                <td title="办理形式" v-html="sourceForm.handletype"></td>
                                <td title="办理形式" v-html="targetForm.handletype"></td>
                            </tr>
                            <tr>
                                <td>办理地点</td>
                                <td title="办理地点" v-html="sourceForm.transactaddr"></td>
                                <td title="办理地点" v-html="targetForm.transactaddr"></td>
                            </tr>
                            <tr>
                                <td>办理时间</td>
                                <td title="办理时间" v-html="sourceForm.transacttime"></td>
                                <td title="办理时间" v-html="targetForm.transacttime"></td>
                            </tr>
                            <tr>
                                <td>咨询方式</td>
                                <td title="咨询方式" v-html="sourceForm.linkway"></td>
                                <td title="咨询方式" v-html="targetForm.linkway"></td>
                            </tr>
                            <tr>
                                <td>咨询电话</td>
                                <td title="咨询电话" v-html="sourceForm.linkTel"></td>
                                <td title="咨询电话" v-html="targetForm.linkTel"></td>
                            </tr>
                            <tr>
                                <td>服务对象</td>
                                <td title="服务对象" v-html="sourceForm.servertype"></td>
                                <td title="服务对象" v-html="targetForm.servertype"></td>
                            </tr>
                            <tr>
                                <td>受理条件</td>
                                <td title="受理条件" v-html="sourceForm.acceptcondition"></td>
                                <td title="受理条件" v-html="targetForm.acceptcondition"></td>
                            </tr>
                            <tr>
                                <td>单点登录</td>
                                <td title="单点登录" v-html="sourceForm.appissinglelogin"></td>
                                <td title="单点登录" v-html="targetForm.appissinglelogin"></td>
                            </tr>
                            <tr>
                                <td>权限划分</td>
                                <td title="权限划分" v-html="sourceForm.approvelimitdivide"></td>
                                <td title="权限划分" v-html="targetForm.approvelimitdivide"></td>
                            </tr>
                            <tr>
                                <td>行使内容</td>
                                <td title="行使内容" v-html="sourceForm.approvelimitdivideexp"></td>
                                <td title="行使内容" v-html="targetForm.approvelimitdivideexp"></td>
                            </tr>
                            <tr>
                                <td>联系人填报方式</td>
                                <td title="联系人填报方式" v-html="sourceForm.contactinformation"></td>
                                <td title="联系人填报方式" v-html="targetForm.contactinformation"></td>
                            </tr>
                            <tr>
                                <td>到办事现场次数</td>
                                <td title="到办事现场次数" v-html="sourceForm.limitscenenum"></td>
                                <td title="到办事现场次数" v-html="targetForm.limitscenenum"></td>
                            </tr>
                        </tbody>
                    </table>
                </div> 
                <div class="dialog-title--global">
                    材料清单
                </div>
                <div class="material-list">
                    <el-row :gutter="20">
                        <el-col :lg="12" :md="24">
                            <el-table border :data="sourceTable" :header-row-style="{backgroundColor:'#7A94C7 !important', fontWeight:'500', color:'#FFFFFF', height:'48px'}">
                                <el-table-column align="center" :label="'版本' + (sourceForm.taskversion as string)?.replace(/<.*?>/g,'')">
                                    <el-table-column show-overflow-tooltip align="center" label="材料名称">
                                        <template #default="s">
                                            <div v-html="s.row.gName"></div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column show-overflow-tooltip align="center" label="材料来源">
                                        <template #default="s">
                                            <div v-html="s.row.mSource"></div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column show-overflow-tooltip align="center" label="材料必要性">
                                        <template #default="s">
                                            <div v-html="s.row.isneed"></div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column show-overflow-tooltip align="center" label="数量要求">
                                        <template #default="s">
                                            <div v-html="s.row.originalNum"></div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column show-overflow-tooltip align="center" label="介质要求">
                                        <template #default="s">
                                            <div v-html="s.row.mMedia"></div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column show-overflow-tooltip align="center" label="受理标准">
                                        <template #default="s">
                                            <div v-html="s.row.auditPoint"></div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column show-overflow-tooltip align="center" label="材料依据">
                                        <template #default="s">
                                            <div v-html="s.row.materialsevidence"></div>
                                        </template>
                                    </el-table-column>
                                </el-table-column>
                            </el-table>
                        </el-col>
                        <el-col :lg="12" :md="24">
                            <el-table border :data="targetTable" :header-row-style="{ backgroundColor: '#7A94C7 !important', fontWeight: '500', color: '#FFFFFF', height:'48px'}">
                                <el-table-column align="center" :label=" '版本' + (targetForm.taskversion as string)?.replace(/<.*?>/g, '')">
                                    <el-table-column show-overflow-tooltip align="center" label="材料名称">
                                        <template #default="s">
                                            <div v-html="s.row.gName"></div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column show-overflow-tooltip align="center" label="材料来源">
                                        <template #default="s">
                                            <div v-html="s.row.mSource"></div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column show-overflow-tooltip align="center" label="材料必要性">
                                        <template #default="s">
                                            <div v-html="s.row.isneed"></div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column show-overflow-tooltip align="center" label="数量要求">
                                        <template #default="s">
                                            <div v-html="s.row.originalNum"></div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column show-overflow-tooltip align="center" label="介质要求">
                                        <template #default="s">
                                            <div v-html="s.row.mMedia"></div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column show-overflow-tooltip align="center" label="受理标准">
                                        <template #default="s">
                                            <div v-html="s.row.auditPoint"></div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column show-overflow-tooltip align="center" label="材料依据">
                                        <template #default="s">
                                            <div v-html="s.row.materialsevidence"></div>
                                        </template>
                                    </el-table-column>
                                </el-table-column>
                            </el-table>
                        </el-col>
                    </el-row>
                </div>
            </div>
            
        </template>
    </ListPageLayout>
</template>
  
<style lang="less" scoped>
@props-item-width:16%;
@current-version-width:40%;
@compared-version-width:43%;

.current-page-title{
    position: relative;
    .modifyButton{
        position: absolute;
        right: 0;
    }
}

.material-list{
    margin-top: 20px;
}
.compar-info{
    margin-top:25px;
    .compar-info-table{
        border:1px solid #C8D7F4;
        border-collapse:collapse;
        .compar-info-table-head{
            background-color: #7A94C7;
            color:#ffffff;
        }
        .compar-info-table-th-0{
            width:16%;
        }
        .compar-info-table-th-1{
            width:42%
        }
        .compar-info-table-th-2{
            width:42%
        }
        thead {
            tr{
                th{
                    font-weight: 500;
                    border-right: 1px solid #DCE1E8;
                    &:last-child{
                        border-right: unset;
                    }
                }
            }
        }
        tbody {
            tr{
                border-bottom: 1px solid #DCE1E8;
                &:last-child{
                    border-bottom: unset;
                }
                td{
                    border-right: 1px solid #DCE1E8;
                    &:last-child{
                        border-right: unset;
                    }
                }
            }
        }
        th{
            text-align: left;
        }
        td, th {
            box-sizing: border-box;
            padding: 14px 38px;
        }

        td{
            height: 48px;
            vertical-align: middle;
            
        }
    }
}

:deep(.el-table thead.is-group th.el-table__cell){
    background-color: unset !important;
}

:deep(.el-table th.el-table__cell){
    background-color: unset !important;
}

:deep(.el-table thead th.el-table__cell){
    background-color: unset !important;
}
</style>
