import type { AxiosInstanceResponseType } from '@/axios';

/**
 * 处理并发
 * @param poolLimit 同时并发数量
 * @param array 并发接口方法
 * @returns 
 */
async function asyncPool(poolLimit:number,array:Promise<AxiosInstanceResponseType>[]){
    let ret: Promise<AxiosInstanceResponseType>[] = [];
    let executing: Promise<AxiosInstanceResponseType>[] = [];
    for(const item of array){
        const p = Promise.resolve().then(()=>item);
        ret.push(p)

        if(poolLimit <= array.length){
            const e: Promise<any>  = p.then(() => executing.splice(executing.indexOf(e), 1));
            executing.push(e);

            if(executing.length >= poolLimit){
                await Promise.race(executing)
            }
        }
    }
    return Promise.all(ret);
}

export default asyncPool;