declare namespace TaskCount {
    export interface GetDetailStatisticCountListResponse {
        /**
         * 非公服目录事项
         */
        setterMatter: string;
        /**
         * 全部事项
         */
        allMatter: string;
        /**
         * 未进驻事项
         */
        otherMatter: string;
        /**
         * 进驻事项
         */
        inMatter: string;
    }

    export interface GetAllMatterParams {
        /** 进驻事项标志 0 进驻 1 未进驻 */
        enterHall?:string;
        /** 事项名称 */
        matterName?: string;
        matterMainName?: string;
        matterSubName?: string;
        /** 事项情形名称 */
        situationName?: string;
        /** 更新时间 */
        updateTime?: string;
        /** 事项类型 */
        taskType?: string;
        name?: string;
        /** 业务类型 */
        workTypeName?: string;
        /** 实施主体 */
        deptName?: string;
        /** 是否高频 */
        isRepeat?: string;
        /** 是否全程网办 */
        isWeb?: string;
        /**同源是否全程网办 */
        isSyncWeb?: string;
        /** 是否收费 */
        isFee?: string;
        /** 所在楼层 */
        matterFloor?: string;
        /** 所在区域 */
        matterArea?: string;
        /** 分流位置 */
        inSystem?: string;
        /** 委派规则 */
        outSystem?: string;
        /** 需要图纸 */
        drawingRequired?: string;
        /** 图纸审核方式 */
        drawingReviewMethod?: string;
        /** 是否可全程网办 */
        isFullOnline?: string;
        /** 是否中台审核 */
        isMiddleMaterial?: string;
        /** 是否多情形 */
        isStation?: string;
        /** 是否是公服事项(否，是) */
        publicService?: string;
        /** 行使层级 */
        useLevel?: string;
        /** 是否依申请 */
        taskTypeClassify?: string;
        pageNo?: number;
        pageSize?: number;
    }

    export interface GetAssignRuleListRequest {
        name?: string;
        createBy?: string;
        createdTime?: string;
        pageNo: number;
        pageSize: number;
    }

    export interface SelectAllParentCatalogueSelectRequest {
        name?: string;
        pageNo: number;
        pageSize: number;
    }


    export interface GetChangeListRequest {
        matterName?: string;
        workTypeName?: string;
        deptName?: string;
        updateTime?: string;
        status?:string;
        isFinish?:string;
        pageNum: number;
        pageSize: number
    }

    export interface HomologyListResponse {
        list: {
            dmId: string;
            dmName: string;
            dmType: string;
            id: number;
            isDelete: string;
            sort: number;
            updateTime: string;
        }[]
    }


    export interface ByMainIdRequest {
        pageNum: number;
        pageSize: number;
        matterId: string;
    }

    export interface AllSetterMatterRequest {
        matterName?: string;
        workTypeName?: string;
        deptName?: string;
        pageNo: number;
        pageSize: number;
    }

    export interface SetterInfoObject {
        id: string;
        matterName: string;
        workType: string;
        matterFloor: string;
        matterArea: string;
        substitutePersonnel: string;
        chiefRepresentative: string;
        matterTeacherName: string;
        matterTeacherJob: string;
        departmentLeaders: string;
    }

    export interface GetMaterialBySituationObj {
        matterId: string;
        situationId: string;
    }
    export interface UpdMatterBasicobj {
        matterId: string; //事项id
        matterTeacherName: string;//事项负责老师
        matterTeacherJob: string;//事项负责老师岗位
        departmentLeaders: string;//处室领导   
        substitutePersonnel: string;//代岗人员姓名
        chiefRepresentative: string;//首席代表
        materialCount: string;//材料数量是否超过3个 1 是 0 否
        situationFlag: string;//是否是情形 0 否 1 是
        isBussiness: string;//是否有办件量 1 是 0 否
        isRepeat: string;//是否为高频事项（1是 0否）
        isWeb: string;//是否可全程网办 1 是 0 否
        handleProcedures: string;//人工梳理办理形式
        businessTypeId: string;//业务类型
        matterRegion: string;//区域
        matterFloor: string;//楼层
        outputType: string;//取件方式
        isTarger: string
    }

    export interface SituationDataObj extends AuditmethodObj {
        situationName: string;
        matterId: string;
        matterName: string;
        situationId?: string;
    }
    export interface SaveSituationobj {
        situationMaterial: SituationMaterialObj[];
        situationData: SituationDataObj;
        materialAcceptanceKey: AcceptanceKeyList[];
        matterRelevantData: MatterRelevantList[];
        matterKeyReminderData: MatterKeyReminder[];
    }

    export interface CompareSyncMatterRequest {
        taskGuid:string;
        taskCode:string;
        taskType:string;
        cdBatchArr:string[];
    }
    export interface SituationMaterialObj {
        id?: string;
        materialId: string;
        materialName: string;
        situationId?: string;
        matterId: string;
        parentId?: string;
    }
    export interface SelectMaterialByMatterObj {
        id: string;
        materialName: string;
        materialId: string;
        materialSource: string;
        materialNecessity: number;
        quantityRequirements?: any;
        mediaRequirements: string;
        sampleTableName: string;
        sampleTableId?: any;
        sampleTableUrl: string;
        emptyTableName: string;
        emptyTableId?: any;
        emptyTableUrl: string;
        otherRequirements?: any;
        orderNo: number;
        materialDesc: string;
        matterId: string;
        materialDescName?: any;
        gtype: string,
        mindex: string
      }
      export interface GetChangeField {
        taskGuid: string;
        taskCode: string;
        taskType: string;
        cdBatchArr: string[];
      }

      export interface GetSubInfoByMatterIdObj{
        is_bussiness: number;
        situation_flag: number;
        material_count: number
    }
    export interface GetMaterialListByMatterIdObj{
        id: string;
        name: string;
        extraStr: string;
        commonExtraStr: string | null;
    }
    
}