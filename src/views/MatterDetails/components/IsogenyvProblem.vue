<script setup lang="ts">
interface Props {
    syncTaskGeneralQuestions: SyncTaskGeneralQuestionsObj[]
}
const props = defineProps<Props>()
console.log('syncTaskGeneralQuestions-------------', props.syncTaskGeneralQuestions)
</script>

<template>
    <dl class="problem_dl" v-for="item in syncTaskGeneralQuestions" :key="item.id">
        <dt>
            <span>问</span>
            <h5>{{ item.question }}</h5>
        </dt>
        <dd>
            <span>答</span>
            <div>{{ item.answer }}</div>
        </dd>
    </dl>
</template>

<style lang="less" scoped>
.problem_dl {
    padding: 24px;
    margin-bottom: 10px;
    background: #F5F6F9;

    dt {
        display: flex;

        span {
            color: #FE8C2E;
            background: rgba(254, 140, 46, 0.1);
        }

        h5 {
            font-size: 14px;
            color: rgba(0, 0, 0, 0.85);
            font-weight: normal;
        }
    }

    dd {
        display: flex;
        margin-top: 24px;

        span {
            color: #2E73FE;
            background: rgba(46, 115, 254, 0.1);
        }

        div {
            color: #8C8C8C;
            font-size: 14px;
        }
    }

    dt span,
    dd span {
        margin-right: 10px;
        display: block;
        width: 22px;
        height: 22px;
        text-align: center;
        line-height: 22px;
        font-size: 12px;
        font-weight: bold;
    }
}</style>