import { axiosUpload } from '../index';
import type { AxiosInstanceResponseType } from '../index';

/**
 * 导入情形
 * @param matterId 
 * @param payload 
 * @returns 
 */
export function generate(matterId:string,payload:Record<string,any>):Promise<AxiosInstanceResponseType>{
    return axiosUpload(`/situation/import/generate/${matterId}`,payload)
}