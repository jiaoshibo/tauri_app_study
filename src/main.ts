import './assets/main.less'

import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css';
import * as lang from 'element-plus/es/locale/index'

import './assets/var.css'

const app = createApp(App)

app.use(router)
app.use(ElementPlus, {locale:lang.zhCn})

app.mount('#app')
