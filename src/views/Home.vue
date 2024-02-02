<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import * as taskCount from '@/axios/api/taskCount';

onBeforeMount(() => {
    getMatterOverview();
})

const router = useRouter();


interface MatterOverItem {
    key: 'allMatter' | 'inMatter' | 'otherMatter' | 'setterMatter' | 'changeCount'; category: string; number: string; trend: number
}

const matterOverview = ref<MatterOverItem[]>([
    {
        key: 'allMatter',
        category: '全部事项',
        number: '0',
        trend: 10
    },
    {
        key: 'inMatter',
        category: '进驻事项',
        number: '0',
        trend: -8
    },
    {
        key: 'otherMatter',
        category: '未进驻事项',
        number: '0',
        trend: 18
    },
    {
        key: 'setterMatter',
        category: '非公服目录事项',
        number: '0',
        trend: 0
    },
    {
        key: 'changeCount',
        category: '事项异动',
        number: '0',
        trend: -1
    }
])

function getMatterOverview() {
    taskCount.getDetailStatisticCountList().then(res => {
        let resData = res.data;
        if (resData.code === 2001) {
            let i: keyof typeof resData.data
            for (i in resData.data) {
                matterOverview.value.forEach(item => {
                    if (item.key === i) {
                        item.number = resData.data[i]
                    }
                })
            }
        }

    })
}

function toMatterListByCategory(type: MatterOverItem['key']) {
    if (type === 'allMatter') { // 全部事项
        navigator('/matterList')
    }else if(type === 'inMatter'){ // 进驻事项
        navigator('/matterList',{enterHall:'0'})
    }
     else if (type === 'otherMatter') { // 未进驻事项
        navigator('/matterList',{enterHall:'1'})
    } else if (type === 'setterMatter') { // 非公服
        navigator('/nonPublicMatterList')
    } else if (type == 'changeCount') { // 事项异动
        navigator('/matterChange')
    }
    else {
        throw new Error('type 值错误')
    }
}


function navigator(path: string, query?:Record<string,any>) {
    router.push({ path, query:{...query} })
}

</script>

<template>
    <div class="home">
        <div class="home-container">
            <div class="shortcut">
                <el-row :gutter="20">
                    <el-col :lg="8" :md="12" :sm="24">
                        <div class="shortcut-item" @click="navigator('/diversionOfMatterList')">
                            <img src="../assets/images/分流配置.png" width="208px" height="192px" style="height:100%;width:auto;" alt="">
                            <div class="shortcut-item-text">
                                <p style="font-weight: 500; color:#262626;">分流配置</p>
                                <p style="color:#8C8C8C; font-size: 14px;">窗口分流规则管理</p>
                            </div>
                            <img width="32px" height="32px" src="../assets/images/right-arrow.png" style="height:16px;margin-left:auto;width:auto;" alt="">
                        </div>
                    </el-col>
                    <el-col :lg="8" :md="12" :sm="24">
                        <div class="shortcut-item" @click="navigator('/associationBinding')">
                            <img width="208px" height="192px" src="../assets/images/关联绑定.png" style="height:100%;width:auto;" alt="">
                            <div class="shortcut-item-text">
                                <p style="font-weight: 500; color:#262626;">关联关系绑定</p>
                                <p style="color:#8C8C8C; font-size: 14px;">字段关联一键绑定</p>
                            </div>
                            <img width="32px" height="32px" src="../assets/images/right-arrow.png" style="height:16px;margin-left:auto;width:auto;" alt="">
                        </div>
                    </el-col>
                    <el-col :lg="8" :md="12" :sm="24">
                        <div class="shortcut-item">
                            <img width="208px" height="192px" src="../assets/images/更多.png" style="height:100%;width:auto;" alt="">
                            <div class="shortcut-item-text">
                                <p style="font-weight: 500; color:#262626;">敬请期待</p>
                                <p style="color:#8C8C8C; font-size: 14px;">更多快捷功能构建中…</p>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <div class="home-card">
                <div class="home-card-title">
                    事项总览
                </div>
                <div class="home-card-content">
                    <template v-for="item in matterOverview" :key="item.key">
                        <div class="home-card-content-item" v-if="item.key!=='changeCount'" :title="item.category" @click="toMatterListByCategory(item.key)">
                            <div>
                                <div class="matter-category">
                                    {{ item.category }}
                                </div>
                                <div class="matter-number">
                                    {{ item.number }}
                                </div>
                                <!-- <div class="matter-trend">
                                    较昨日 
                                    <span v-if="item.trend>0" style="color:#21C261; font-weight:700;">↑</span>
                                    <span v-else-if="item.trend<0" style="color:#ED4646; font-weight:700;">↓</span>
                                    <span v-else>-</span>
                                    {{ Math.abs(item.trend) }}
                                </div> -->
                            </div>
                        </div>    
                    </template>
                </div>
            </div>
            <div class="home-card" style="background: #fff;">
                <div class="home-card-title">
                    运营维护
                </div>
                <div class="home-card-content">
                    <div class="matter-change-overview" @click="navigator('/matterChange')">
                        <div class="matter-change-overview-icon">
                            <img width="96px" height="96px" src="@/assets/images/matter-change-icon.png" alt="icon" style="width:100%;height:auto;">
                        </div>
                        <div class="matter-change-overview-content">
                            <div class="matter-change-label">事项异动</div>
                            <div class="matter-change-value">{{ matterOverview.find(item => item.key === 'changeCount')?.number
                            }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="less">
.home {
    width: 100%;
    height: 100%;
    background-image: url("@/assets/images/home_bg.png");
    background-repeat: no-repeat;
    background-size: cover;

    .home-container {
        padding: 20px 24px;
    }

    .shortcut {
        .shortcut-item {
            display: flex;
            align-items: center;
            height: 96px;
            background-image: linear-gradient(180deg, #ebeff4, #ffffff);
            border-radius: 2px;
            padding-right: 24px;
            margin-bottom: 20px;
            line-height: 26px;
            cursor: pointer;
            border: 1px solid #ffffff;
        }
    }

    .home-card {
        padding: 20px 12px 36px 12px;
        background-image: linear-gradient(180deg, #EFF6FF, #ffffff 35%);
        border-radius: 2px;
        border: 1px solid #ffffff;

        &:last-child {
            margin-top: 20px;
        }

        .home-card-content {
            display: flex;
            padding: 24px 24px 0 12px;

            .matter-change-overview {
                cursor: pointer;
                width: 231px;
                border-radius: 2px;
                background: rgba(237, 70, 70, 0.02);
                padding: 20px;
                display: flex;

                .matter-change-overview-icon {
                    width: 48px;
                    height: 48px;
                    background: #FDE8E8;
                    border-radius: 8px 8px 8px 8px;
                    margin-right: 16px;
                }

                .matter-change-overview-content {
                    line-height: 26px;

                    .matter-change-label {
                        color: #525252;
                        font-size: 14px;
                    }

                    .matter-change-value {
                        font-size: 18px;
                        color: #262626;
                        font-weight: 500;
                    }
                }
            }

            .home-card-content-item {
                width: 285px;
                border-right: 1px solid rgba(216, 216, 216, 0.3);
                display: flex;
                justify-content: center;
                cursor: pointer;

                &:first-child {
                    width: 185px;
                    justify-content: left;
                }

                &:last-child {
                    border-right: unset;
                }

                .matter-category {
                    color: #525252;
                    font-size: 16px;
                    margin-bottom: 8px;
                }

                .matter-number {
                    font-size: 24px;
                    color: #262626;
                    font-weight: 500;
                }

                .matter-trend {
                    color: #8C8C8C;
                    font-size: 14px;
                    margin-top: 24px;
                }
            }
        }

        .home-card-title {
            color: #262626;
            font-weight: 500;
            font-size: 18px;
            display: flex;
            align-items: center;

            &:before {
                content: "";
                width: 6px;
                height: 16px;
                background-color: #2E73FE;
                border-top-right-radius: 2px;
                border-bottom-right-radius: 2px;
                display: block;
                margin-right: 6px;

            }
        }
    }
}</style>