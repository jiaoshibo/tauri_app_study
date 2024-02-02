import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue';
import { compression } from 'vite-plugin-compression2';
// import mkCert from 'vite-plugin-mkcert';

// https://vitejs.dev/config/
export default defineConfig(({mode})=>{
  const env = loadEnv(mode, process.cwd());
  let outDir:string;
  if(mode==='test'){
    outDir = 'dist/test'
  }else if(mode==='production'){
    outDir = 'dist/prod'
  }else{
    outDir = 'dist/other'
  }
  return {
    // base:'/sxk',
    plugins: [
      vue(),
      compression({
        skipIfLargerOrEqual:true,
        threshold:1024
      }),
      // 配置https证书
      /*mkCert({
        source:'coding',
      })*/
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    build:{
      outDir:outDir,
      target:["es2021","chrome100","safari13"],
      // don't minify for debug builds
      minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
      // produce sourcemaps for debug builds
      sourcemap: !!process.env.TAURI_DEBUG,
    },
    server:{
      https:false,
      host:'0.0.0.0',
      port:8551,
      proxy:{
        [env.VITE_BASE_URL]:{
          // target:'http://10.8.0.150:9999',
          // target:'http://10.8.0.122:9999',
          target:'http://yckt.syngovision.cn:8888/sxkapi',
          changeOrigin:true,
          rewrite:(path)=>{
            let regPath = new RegExp(`^\\${env.VITE_BASE_URL}`);
            return path.replace(regPath,'')
          }
        }
      }
    },
    css:{
      devSourcemap: mode === 'development'
    },
    clearScreen:false,
    envPrefix: ['VITE_', 'TAURI_'],
  }
})
