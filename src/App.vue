<script setup lang="ts">
import {ref, onBeforeMount, onMounted} from "vue";
import {invoke} from "@tauri-apps/api";
import {appWindow,} from '@tauri-apps/api/window'

import { RouterView } from 'vue-router';
import Menu from '@/components/Menu.vue';
import {getUserInfo, type UserInfo} from "@/axios/auth";
import {userStorage} from "@/utils/localforage";
import {RustCommand, type RustCommandReturnType} from "@/command/rustCommand";

onBeforeMount(()=>{
  // if(!isDev.value) login()
  invoke<RustCommandReturnType['greet']>(RustCommand.greet,{name:'hello world'}).then(res=>{
    console.log(res)
  })
})

onMounted( async()=>{
  await  invoke<RustCommandReturnType['close_splashscreen']>(RustCommand.close_splashscreen);
    // stopDefaultContextMenu();
})

const isDev = ref(import.meta.env.DEV||import.meta.env.MODE==='test')

const buttonConfig = {
  autoInsertSpace:true
}


async function login(){
  let res = await getUserInfo();
  let {code,data,message} = res.data;
  if(code===2001){
    let userInfo = await userStorage.getItem<UserInfo>('userInfo');
    if(userInfo && userInfo.userId===data.userId){
    
    }else{
      let userInfo = await userStorage.setItem<UserInfo>('userInfo',data).then(()=>{
        return userStorage.getItem<UserInfo>('userInfo')
      })
      console.log('4A_userInfo:::',userInfo)
    }
  }
}

function window_minimize(){
  appWindow.minimize()
}

function window_maximize(){
  appWindow.toggleMaximize();
}

function window_close(){
  appWindow.close();
}

/**
 * 阻止鼠标右键事件
 */
function stopDefaultContextMenu(){
  document.oncontextmenu = function (e) {
    e.preventDefault();
  }
}

</script>

<template>
  <el-config-provider :button="buttonConfig">
    <el-container style="height: 100%">
      <el-aside v-if="isDev">
        <Menu />
      </el-aside>
      <el-main style="padding: 0">
        <RouterView />
      </el-main>
    </el-container>
  </el-config-provider>
</template>

<style lang="less" scoped>
.titlebar {
  height: 30px;
  background: #65a332;
  user-select: none;
  display: flex;
  justify-content: flex-end;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
}
.titlebar-button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
}
.titlebar-button:hover {
  background: #5bbec3;
}
</style>
