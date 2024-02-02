/**
 * 表格分页配置
 */
export class PageConfig {
    private currentPage:number;
    private pageSize:number;
    private totalCount:number;

    private readonly layout:string;
    private readonly pageSizes:number[];

    constructor() {
        this.currentPage = 1;
        this.pageSize = 20;
        this.pageSizes = [10,20,50];
        this.totalCount = 0;
        this.layout="total, sizes, prev, pager, next";
    };
    set setCurrentPage(val:number){
        this.currentPage = val;
    }
    get getCurrentPage(){
        return this.currentPage;
    }

    set setPageSize(val:number){
        this.pageSize = val;
    }
    get getPageSize(){
        return this.pageSize;
    }

    set setTotalCount(val:number){
        this.totalCount = val;
    }
    get getTotalCount(){
        return this.totalCount;
    }
    get getPageSizes (){
        return this.pageSizes;
    }

    get getLayout(){
        return this.layout;
    }
    /**
     * 分页切换
     * @param currentPage
     * @param callback 回调函数
     */
    onCurrentPageChange(currentPage:number,callback:()=>void){
        this.setCurrentPage = currentPage;
        if(callback) callback();
    }

    /**
     * 每页条数切换
     * @param pageSize
     * @param callback 回调函数
     */
    onPageSizeChange(pageSize:number, callback:()=>void) {
        this.setCurrentPage = 1;
        this.setPageSize = pageSize;
        if(callback) callback();
    }
}


/**
 * 表格序号
 * @param index 当前表格序号
 * @param currentPage 当前页
 * @param pageSize 当前表格条数
 */
export function useTableIndex(index:number,currentPage:number, pageSize:number){
    return index + 1 + (currentPage-1) * pageSize
}