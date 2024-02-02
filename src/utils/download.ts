import type { AxiosResponse } from 'axios';

/**
 * 公共的下载方法
 * @param response 接口响应对象
 */
export function download(response: AxiosResponse){
    const blob: Blob = new Blob([response.data]);
    let fileName = decodeURI(response.headers['content-disposition'].split(';')[1].split('filename=')[1]);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.setAttribute('download', fileName);
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
}