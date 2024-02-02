<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { RouteRecord } from 'vue-router'
import {ref} from "vue";
import type {Ref,UnwrapRef} from 'vue'

const router = useRouter();

const routerList:Ref<UnwrapRef<RouteRecord[]>> = getRouterList()

function getRouterList(){
    return ref(router.getRoutes().filter(item=>item.meta.routeType==='list'||item.meta.routeType==='home'))
}


const currentRouter = router.currentRoute
</script>

<template>
    <el-menu mode="vertical" router :default-active="currentRouter.path">
        <el-menu-item :index="item.path" v-for="item in routerList" :route="item">
            <span>{{ item.meta.name }}</span>
        </el-menu-item>
    </el-menu>
</template>

<style scoped lang="less">

</style>