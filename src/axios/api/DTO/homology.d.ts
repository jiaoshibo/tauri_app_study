//同源基本信息
declare interface SyncBasicObj {
    id: string;
    taskguid: string;
    matterMainId?: any;
    matterMainName: string;
    matterSubId?: any;
    matterSubName?: any;
    matterId: string;
    matterName: string;
    catalogMainCode: string;
    catalogSubCode?: any;
    catalogMatterCode: string;
    localcatalogcode?: any;
    taskType: string;
    taskTypeClassify: string;
    byLaw: string;
    powerSource: string;
    useLevel: string;
    approveLimitDivide: string;
    approveLimitDivideExp?: any;
    taskCode: string;
    localTaskcode?: any;
    taskHandleItem: string;
    taskState: string;
    taskversion: string;
    businesscharacter: string;
    departmentCode: string;
    deptName: string;
    deptType: string;
    deptCode: string;
    entrustName?: any;
    managerDept: string;
    anticipateDay: string;
    anticipateType: string;
    anticipateExplain?: any;
    promiseDay: string;
    promiseType: string;
    promiseExplain: string;
    acceptCondition: string;
    isFee: string;
    feeBasis?: any;
    serverType: string;
    projectType: string;
    handleType: string;
    limitsceneNum: string;
    specialprocedure: string;
    appissinglelogin: string;
    mobileterminalurl?: any;
    issinglelogin: string;
    linkAddr: string;
    transactAddr: string;
    transactTime: string;
    linkWay: string;
    linkWindow: string;
    linkWeb?: any;
    linkTel: string;
    linkLetter?: any;
    linkEmail?: any;
    supervisePhone: string;
    superviseWay: string;
    windowComplaint: string;
    webComplaint?: any;
    telComplaint?: any;
    letterComplaint?: any;
    emailComplaint?: any;
    planeffectivedate?: any;
    plancanceldate?: any;
    havetaskhandleitem: string;
    itemYxxt?: any;
    isPublicity: string;
    reportingstaffinfo: string;
    contactinformation: string;
    isFixedassets: string;
    isestablishitem?: any;
    establishtype?: any;
    statutaryunitsCode: string;
    locatedwindow: string;
    issupportapp?: any;
    appname?: any;
    littleprogramname?: any;
    wechatPublicAccount?: any;
    usertargetType?: any;
    userperiodType?: any;
    corptargetType: string;
    corpperiodType: string;
    acceptName?: any;
    acceptCode?: any;
    sxId?: any;
    itemId?: any;
    systemId: string;
    systemPid: string;
    ordernum: string;
    cdOperation: string;
    cdTime: string;
    cdBatch: string;
    datasource: string;
    distributetag: string;
    datajsontext: string;
    isKey?: any;
    isDelete: string;
    moverallReq?: any;
  }
//同源材料
declare interface SyncMaterialObj {
    taskName: string;
    mName: string;
    gName: string;
    gType: string;
    orreleation: string;
    gSummary: string;
    ordernum: string;
    ordernumBig: string;
    mType: string;
    certOffice: string;
    isReserved?: any;
    isDuplicate?: any;
    isCheck?: any;
    isDuplicateCheck?: any;
    isOriginal?: any;
    isCopy?: any;
    isDuplicateOriginal?: any;
    isDuplicateCopy?: any;
    isBase?: any;
    originalNum?: any;
    copyNum?: any;
    duplicateNum?: any;
    duplicateCopyNum?: any;
    otherNum?: any;
    isFt?: any;
    isFb?: any;
    isFj?: any;
    mSource: string;
    mMedia: string;
    requirement?: any;
    auditPoint?: any;
    isBz?: any;
    pageformat?: any;
    isneed: string;
    materialsubmitmode?: any;
    materialsevidence?: any;
    remark?: any;
    sampleTableName: string;
    sampleTableId?: any;
    sampleTableUrl: string;
    emptyTableName: string;
    emptyTableId?: any;
    emptyTableUrl: string;
    gId: string;
    gPid: string;
    mIndex: string;
    nodeLevel: string;
  }
//办理流程
declare interface SyncMatterProcessObj {
    id: string;
    matterId: string;
    content: string;
    type: string;
    docId: string;
    docName?: any;
    xmldata?: any;
    createdBy?: any;
    updatedBy?: any;
    createdTime: string;
    updatedTime?: any;
    cdBatch: string;
    isDelete: number;
    maybe?: any;
}
//结果物极样本
declare interface SyncMatterResultObj {
    id: number;
    taskguid: string;
    systemId: string;
    systemPid?: any;
    resultname: string;
    resulttype: string;
    resulttypeExp?: any;
    resultflag: string;
    gavecopy: string;
    resultLimit: string;
    docId: string;
    docName: string;
    otherAttachment?: any;
    numrules?: any;
    effectivedate?: any;
    docStartDate?: any;
    docEndDate?: any;
    effectivedateExp?: any;
    resultExp?: any;
    resultCode: string;
    quoteName?: any;
    ordernum: string;
    cdTime: string;
    cdBatch: string;
    distributetag: string;
    datajsontext: string;
    createdBy?: any;
    updatedBy?: any;
    createdTime: string;
    updatedTime?: any;
    isDelete: number;
    maybe?: any;
}

//收费标准
declare interface SyncMatterChargeObj {
  id: string;
  matterId: string;
  feeName: string;
  feeStand: string;
  byLaw: string;
  isDesc: string;
  remark: string;
  createdBy?: any;
  updatedBy?: any;
  createdTime: string;
  updatedTime?: any;
  isDelete: number;
  maybe?: any;
}
//设定依据
declare interface SyncDirectoryLawObj {
    id: number;
    gmtCreate?: any;
    gmtModified?: any;
    isDeleted?: any;
    creator?: any;
    editor?: any;
    notes?: any;
    taskguid: string;
    lawType: string;
    lawOwner: string;
    lawName: string;
    lawCode: string;
    lawContent: string;
    lawSortIndex: number;
    isPublicLaw?: any;
    isSelf?: any;
    cdTime: string;
    cdBatch: string;
    distributetag: string;
    lawUrl: string;
    datajsontext: string;
    acceptservice?: any;
    isort?: any;
  }
  //办理流程
declare interface SyncMatterSubProcessObj  {
    id: string;
    matterId: string;
    phaseStdName: string;
    phaseName: string;
    phaseLimit: number;
    phaseType: string;
    phaseApprove: string;
    phaseResult: string;
    phaseCode: string;
    phaseIndex: string;
    phaseBigIndex: string;
    sendType: string;
    createdBy?: any;
    updatedBy?: any;
    createdTime: string;
    updatedTime?: any;
    isDelete: number;
    maybe?: any;
  }

//常见问题
declare interface SyncTaskGeneralQuestionsObj {
    id: string;
    taskguid: string;
    taskcode: string;
    taskhandleitem: string;
    question: string;
    answer: string;
    ordernum: string;
    cdBatch: string;
    createdBy?: any;
    updatedBy?: any;
    createdTime: string;
    updatedTime?: any;
    isDelete: string;
    maybe?: any;
}

declare interface SyncBasicExtendObj {
    id: string;
    taskguid: string;
    taskcode: string;
    taskhandleitem: string;
    isentrycenter: string;
    halltype: string;
    hallmode: string;
    professionalHallName?: any;
    handlearea: string;
    handleMode: string;
    otherdept?: any;
    servicetype: string;
    limitexplain: string;
    declareway: string;
    webYy?: any;
    numYy: string;
    ispayonline: string;
    isexpress: string;
    isserviceterminals: string;
    blprogress: string;
    usertopictype?: any;
    usercharactertopictype?: any;
    corptopictype: string;
    corpcharactertopictype?: any;
    isonline: string;
    onlinehandledepth: string;
    onlinehandleurl: string;
    limitsceneexplain?: any;
    townname?: any;
    towncode?: any;
    villagename?: any;
    villagecode?: any;
    businesssituation?: any;
    extendfield?: any;
    ordernum: number;
    cdTime: string;
    cdBatch: string;
    distributetag: string;
    datajsontext: string;
    createdBy?: any;
    updatedBy?: any;
    createdTime: string;
    updatedTime?: any;
    isDelete: string;
    maybe?: any;
}
declare interface HomologyData {
    syncBasic: SyncBasicObj;
    syncMaterial: SyncMaterialObj[];
    syncMatterProcess: SyncMatterProcessObj[];
    syncMatterResult: SyncMatterResultObj[];
    syncMatterCharge: SyncMatterChargeObj[];
    syncDirectoryLaw: SyncDirectoryLawObj[];
    syncMatterSubProcess: SyncMatterSubProcessObj[];
    syncTaskGeneralQuestions: SyncTaskGeneralQuestionsObj[];
    syncBasicExtend: SyncBasicExtendObj
}