declare interface ListPage {
    pageNum:number;
    pageSize:number;
    total:number;
    isLastPage:boolean;
    isFistPage:boolean;
    hasPreviousPage:boolean;
    hasNextPage:boolean;
}