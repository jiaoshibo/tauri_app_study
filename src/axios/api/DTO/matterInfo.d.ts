//基本信息
declare interface BasicObject {
  id?: string | null;
  settleId?: string | null;
  matterId?: string | null;
  matterName?: string | null;
  matterType?: string | null;
  matterSituation: string | null;
  matterFloor?: string | null;
  matterArea?: string | null;
  workType?: string | null;
  isWeb?: string | null;
  handleProcedures?: string | null;
  urlName?: string | null;
  urlAddress?: string | null;
  urlOperationExplain?: string | null;
  matterVideo?: string | null;
  isRepeat?: string | null;
  inSystem?: string | null;
  outSystem?: string | null;
  isMiddleMaterial?: string | null;
  isStation?: string | null;
  middleWeb?: string | null;
  windowsWeb?: string | null;
  matterTeacherName?: string | null;
  matterTeacherJob?: string | null;
  matterTicketLimite?: string | null;
  matterTicketNumber?: string | null;
  matterMiniExplain?: string | null;
  matterMachineExplain?: string | null;
  windowsExplain?: string | null;
  exampleTable?: string | null;
  emptyTable?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdTime?: string | null;
  updatedTime?: string | null;
  isDelete?: string | null;
  maybe?: string | null;
  json?: string | null;
  maybeUse?: string | null;
  jsonUse?: string | null;
}
//知识库
declare interface KnowledgeObj {
  id: string;
  knowledgePoints?: string;
  similitudeMethod?: string;
  relatedIssues?: string;
  answersKnowledgePoints: string;
  knowledgePointsPublicity: string;
  effectiveDate?: string;
  expiryDate?: string;
  situationId: string;
  createdBy?: string;
  updatedBy?: string;
  createdTime?: string;
  updateTime?: string;
  updatedTime?: string;
  isDelete?: string;
}

//案例库
declare interface CaseObj {
  id?: string;
  createdBy?: string;
  updatedBy?: string;
  createdTime: string;
  updatedTime?: string;
  isDelete?: number;
  aseTitle?: string;
  caseAnswers?: string;
  knowledgePointsPublicity?: string;
  situationId?: string;
  updateTime?: string;
}

//情形
declare interface SituationObj {
  id: string;
  matterId: string;
  situationId: string;
  matterName: string;
  matterType?: any;
  matterSituation: string;
  matterFloor: string;
  matterArea: string;
  workType?: any;
  isWeb: string;
  handleProcedures: string;
  urlName: string;
  urlAddress: string;
  urlOperationExplain?: any;
  matterVideo?: any;
  isRepeat: string;
  inSystem: string;
  outSystem: string;
  isMiddleMaterial: string;
  isStation?: any;
  middleWeb: string;
  windowsWeb: string;
  matterTeacherName: string;
  matterTeacherJob: string;
  matterTicketLimite: string;
  matterTicketNumber: string;
  matterMiniExplain?: any;
  matterMachineExplain?: any;
  windowsExplain?: any;
  exampleTable?: any;
  emptyTable?: any;
  maybeUse?: any;
  createdBy?: any;
  updatedBy?: any;
  createdTime: string;
  updatedTime?: any;
  isDelete: string;
  maybe?: any;
  json?: any;
  jsonUse?: any;
  provideDelayedServices: number;
  businessDayDelay: string;
  weekdayExtendedServicePeriod: string;
  weekendDelay: string;
  weekendExtendedServicePeriod: string;
  drawingRequired: number;
  drawingReviewMethod: string;
  materialReviewMethod: string;
  businessTypeId: string;
  servicePortBusinessTypeId: string;
  chiefRepresentative: string;
  substitutePersonnel: string;
  source: number;
  situationFlag: number;
  departmentLeaders: string;
  materialCount: number;
  isOutsideRepeat: string;
  isBussiness: string;
  isFullOnline: string;
  matterRegion: string;
  appid?: any;
  thirdUniqueId?: any;
  outputType?: any;
}

declare interface MatterInfo {
  qa: Qa[];
  casesQa: CasesQa[];
  basic: Basic;
  situation: SituationObj[];
  outputType: string | null
}

//下拉字典
declare interface DictionaryObj {
  id: string;
  name: string;
  type: number;
  content: string;
  createdBy?: string;
  updatedBy?: string;
  createdTime?: string;
  updatedTime?: string;
  isDelete?: string;
  value: string;
}
//知识库参数
declare interface knowledgePointsParams {
  id?: string
  knowledgePoints: string;
  similitudeMethod: string;
  relatedIssues: string;
  answersKnowledgePoints: string;
  knowledgePointsPublicity: string;
  effectiveDate: string;
  expiryDate: string;
  situationId: string;
}
//知识库参数新建返回
declare interface knowledgePointsSuccess extends knowledgePointsParams {
  createdTime: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  updatedTime: string | null;
  isDelete: string | null;
}

//案例库参数
declare interface caseParams {
  id?: string
  aseTitle: string;
  caseAnswers: string;
  knowledgePointsPublicity: string;
  answersKnowledgePoints?: string;
  situationId: string;
}

//情形材料
declare interface MatterListObj {
  id?: string;
  materialId: string;
  materialName: string;
  matterId: string;
  situationId: string;
  acceptanceKeyList: AcceptanceKeyList[];
}
//受理要点
declare interface AcceptanceKeyList {
  id?: string | null;
  acceptanceKey: string;
  acceptanceKeyPublicity: string;
  fillInKey: string;
  isFalliblePoint: string;
  fillInRemind: string | null;
  materialId?: string | null;
  situationId: string;
  matterId: string;
  disabled?: boolean;
}

//情形-查询参数
declare interface GetMaterialBySituationObj {
  matterId: string;
  situationName: string;
}

//相关事项--新建查询
declare interface CorrelationData {
  total: number;
  list: CorrelationList[];
  pageNum: number;
  pageSize: number;
  size: number;
  startRow: number;
  endRow: number;
  pages: number;
  prePage: number;
  nextPage: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  navigatePages: number;
  navigatepageNums: number[];
  navigateFirstPage: number;
  navigateLastPage: number;
}

//相关事项地址
declare interface CorrelationList {
  id: string;
  name: string;
  extraStr: string;
  commonExtraStr: string | null;
}

declare interface SituationDialoginfoObj extends AuditmethodObj {
  matterRelevantList: MatterRelevantList[];
  matterKeyReminders: MatterKeyReminder[];
  matterId?: any;
  situationId?: any;
  situationName: string;
  inSystem: string;
  outSystem: string;
  matterArea: string;
}

// 审核方式
declare interface AuditmethodObj {
  drawingRequired: string;
  drawingReviewMethod: string;
  materialReviewMethod: string;
  isMiddleMaterial: string;
}
//重点提醒列表--查询详情
declare interface MatterKeyReminder {
  id?: string;
  matterId: string;
  situationId: string;
  keyReminder: string;
  keyReminderExample?: any;
  keyReminderPublicity: string;
  updateTime?: any;
}
//相关事项列表--查询详情
declare interface MatterRelevantList {
  id?: string;
  matterId: string;
  situationId: string;
  relevantMattersName: string;
  relevantMattersUnit: string;
  relevantMattersAddress: string;
  updateTime?: any;
}