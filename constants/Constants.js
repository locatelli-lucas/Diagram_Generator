export const primitives = {
    UUID: "UUID",
    Boolean: "Boolean",
    Integer: "Integer",
    Decimal: "Decimal",
    Double: "Double",
    Date: "Date",
    Time: "Time",
    Timestamp: "Timestamp",
    DateTime: "DateTime",
    String: "String",
    Binary: "Binary",
    LargeBinary: "LargeBinary",
    LargeString: "LargeString",
    Map: "Map",
    Vector: "Vector"
}

// Entities organized by namespace with distinct colors for diagram visualization
export const categoryTaxonomyEntities = {
    "artificialIntelligence": {
        color: "f46325",
        file: "artificialIntelligence-schema.cds",
        entities: {
            AIFeatureConfiguration: "AIFeatureConfiguration",
            ArticleToken: "ArticleToken",
            ArtificialIntelligenceAcknowledgment: "ArtificialIntelligenceAcknowledgment",
            ArtificialIntelligenceConfiguration: "ArtificialIntelligenceConfiguration",
            ArtificialIntelligenceOutput: "ArtificialIntelligenceOutput",
            ArtificialIntelligenceTokenUsage: "ArtificialIntelligenceTokenUsage",
            ContextChange: "ContextChange",
            GeneratedArticle: "GeneratedArticle",
            PromptToken: "PromptToken",
            RegenerateControl: "RegenerateControl"
        }
    },
    "categoryPlan": {
        color: "c9841d",
        file: "categoryPlan-schema.cds",
        entities: {
            ApprovalDocument: "ApprovalDocument",
            ApprovalDocumentComment: "ApprovalDocumentComment",
            ApprovalDocumentHistory: "ApprovalDocumentHistory",
            CategoryPlan: "CategoryPlan",
            CategoryPlanBusinessUnit: "CategoryPlanBusinessUnit",
            CategoryPlanMandatoryTools: "CategoryPlanMandatoryTools",
            CategoryPlanOptionalTools: "CategoryPlanOptionalTools",
            CategoryPlanRegion: "CategoryPlanRegion",
            DefaultPlan: "DefaultPlan"
        }
    },
    "categorySpend": {
        color: "4de5cf",
        file: "categorySpend-schema.cds",
        entities: {
            Preferencing: "Preferencing",
            Risk: "Risk",
            RiskExposureCategoryModelCds: "RiskExposureCategoryModelCds",
            RiskOverview: "RiskOverview",
            SpendByCategory: "SpendByCategory",
            SpendByRegion: "SpendByRegion",
            SpendBySubCategory: "SpendBySubCategory",
            SpendBySupplier: "SpendBySupplier"
        }
    },
    "categorySpendSnapshot": {
        color: "2ed6cf",
        file: "categorySpendSnapshot-schema.cds",
        entities: {
            SpendByCategory: "SpendByCategory",
            SpendBySubCategory: "SpendBySubCategory",
            SpendBySupplier: "SpendBySupplier",
            Preferencing: "Preferencing",
            SpendByRegion: "SpendByRegion"
        }
    },
    "categoryStrategies": {
        color: "36afe2",
        file: "categoryStrategies-schema.cds",
        entities: {
            CategoryStrategies: "CategoryStrategies",
            CategoryStrategy: "CategoryStrategy",
            CategoryStrategyGoal: "CategoryStrategyGoal",
            CategoryStrategyGoalRecommendation: "CategoryStrategyGoalRecommendation",
            CategoryStrategyRecommendation: "CategoryStrategyRecommendation",
            CategoryStrategyRecommendationHistory: "CategoryStrategyRecommendationHistory",
            CategoryStrategyRequirement: "CategoryStrategyRequirement",
            CategoryStrategyRequirementRecommendation: "CategoryStrategyRequirementRecommendation"
        }
    },
    "categoryValueLever": {
        color: "2e65b8",
        file: "categoryValueLever-schema.cds",
        entities: {
            CategoryValueLever: "CategoryValueLever"
        }
    },
    "common": {
        color: "8ce236",
        file: "common-schema.cds",
        entities: {
            AttachmentInfo: "AttachmentInfo",
            AuditLogMessage: "AuditLogMessage",
            CustomConfiguration: "CustomConfiguration",
            KeyValuePair: "KeyValuePair"
        }
    },
    "costStructure": {
        color: "8c47d1",
        file: "costStructure-schema.cds",
        entities: {
            CostStructureBusinessUnit: "CostStructureBusinessUnit",
            CostStructureConfiguration: "CostStructureConfiguration",
            CostStructureGroup: "CostStructureGroup",
            CostStructureGroupBusinessUnit: "CostStructureGroupBusinessUnit",
            CostStructureGroupRegion: "CostStructureGroupRegion",
            CostStructureImport: "CostStructureImport",
            CostStructureInfo: "CostStructureInfo",
            CostStructureMapping: "CostStructureMapping",
            CostStructureRegion: "CostStructureRegion"
        }
    },
    "customClassification": {
        color: "253af4",
        file: "customClassification-schema.cds",
        entities: {
            ClassificationImportResponse: "ClassificationImportResponse",
            ClassificationValidationError: "ClassificationValidationError",
            CustomClassification: "CustomClassification",
            CustomClassificationInfo: "CustomClassificationInfo",
            MappingValidationError: "MappingValidationError",
            ValidateMappingWithCategoryResponse: "ValidateMappingWithCategoryResponse"
        }
    },
    "customTool": {
        color: "b10bda",
        file: "customTool-schema.cds",
        entities: {
            CustomTool: "CustomTool",
            CustomToolAttachment: "CustomToolAttachment",
            CustomToolToPlan: "CustomToolToPlan",
            CustomToolToPlanAttachment: "CustomToolToPlanAttachment"
        }
    },
    "externalFactorsAnalysis": {
        color: "e8a52e",
        file: "externalFactorsAnalysis-schema.cds",
        entities: {
            ExternalAnalysisTool: "ExternalAnalysisTool",
            ExternalAnalysisAttachment: "ExternalAnalysisAttachment",
            ExternalFactor: "ExternalFactor",
            KeyFactor: "KeyFactor",
            ExternalFactorLevelValueHelper: "ExternalFactorLevelValueHelper",
            ExternalAnalysisImpactValueHelper: "ExternalAnalysisImpactValueHelper",
            ExternalAnalysisProbabilityValueHelper: "ExternalAnalysisProbabilityValueHelper",
            ExternalFactorLevel: "ExternalFactorLevel",
            RequiredRiskLevelThreshold: "RequiredRiskLevelThreshold",
            ExternalFactorCardData: "ExternalFactorCardData",
            ExternalFactorSummary: "ExternalFactorSummary",
            KeyFactorSummary: "KeyFactorSummary",
            KeyFactorError: "KeyFactorError",
            ExternalFactorInfo: "ExternalFactorInfo",
            ExternalAnalysisResult: "ExternalAnalysisResult",
            PlanWithNewExternalFactorsLog: "PlanWithNewExternalFactorsLog"
        }
    },
    "divisionalPlans": {
        color: "47d1a8",
        file: "divisionsAndBusinessUnits-schema.cds",
        entities: {
            BusinessUnit: "BusinessUnit",
            BusinessUnitToggle: "BusinessUnitToggle"
        }
    },
    "goal": {
        color: "d6935c",
        file: "goal-schema.cds",
        entities: {
            Goal: "Goal",
            GoalsRegion: "GoalsRegion"
        }
    },
    "initiative": {
        color: "d1c347",
        file: "initiative-schema.cds",
        entities: {
            AribaCommodity: "AribaCommodity",
            AribaDepartment: "AribaDepartment",
            AribaRegion: "AribaRegion",
            Benefits: "Benefits",
            Initiative: "Initiative",
            InitiativeAttachment: "InitiativeAttachment",
            InitiativeCompleteDetails: "InitiativeCompleteDetails",
            InitiativeObsoleteDetails: "InitiativeObsoleteDetails",
            InitiativePhaseDescription: "InitiativePhaseDescription",
            InitiativeProject: "InitiativeProject",
            InitiativeRegion: "InitiativeRegion",
            InitiativeValueLever: "InitiativeValueLever",
            Investments: "Investments",
            SourcingProject: "SourcingProject"
        }
    },
    "lawAndRegulation": {
        color: "3f1dc9",
        file: "lawAndRegulation-schema.cds",
        entities: {
            CompanyPolicy: "CompanyPolicy",
            LawAndRegulation: "LawAndRegulation"
        }
    },
    "managementView": {
        color: "e236d1",
        file: "management-view-schema.cds",
        entities: {
            DefaultPreferenceView: "DefaultPreferenceView",
            FavoriteMap: "FavoriteMap",
            UserPreferenceCategory: "UserPreferenceCategory",
            UserPreferenceColumns: "UserPreferenceColumns",
            UserPreferenceGoalType: "UserPreferenceGoalType",
            UserPreferenceKPI: "UserPreferenceKPI",
            UserPreferencePhase: "UserPreferencePhase",
            UserPreferenceView: "UserPreferenceView",
            UserViews: "UserViews"
        }
    },
    "marketDynamics": {
        color: "f2b90d",
        file: "marketDynamics-schema.cds",
        entities: {
            MarketDynamics: "MarketDynamics",
            MarketDynamicsAnswer: "MarketDynamicsAnswer",
            MarketDynamicsBusinessUnit: "MarketDynamicsBusinessUnit",
            MarketDynamicsConfiguration: "MarketDynamicsConfiguration",
            MarketDynamicsImport: "MarketDynamicsImport",
            MarketDynamicsMapping: "MarketDynamicsMapping",
            MarketDynamicsMappingInfo: "MarketDynamicsMappingInfo",
            MarketDynamicsRegion: "MarketDynamicsRegion"
        }
    },
    "marketIntelligence": {
        color: "dee54d",
        file: "marketIntelligence-schema.cds",
        entities: {
            MarketIntelligenceDestinationMapping: "MarketIntelligenceDestinationMapping",
            MarketIntelligenceNewsMapping: "MarketIntelligenceNewsMapping",
            UserNewsFeedInteraction: "UserNewsFeedInteraction"
        }
    },
    "masterdata": {
        color: "25f43a",
        file: "masterdata.cds",
        entities: {
            BusinessImpactAssessmentQuestion: "BusinessImpactAssessmentQuestion",
            CostComponent: "CostComponent",
            Department: "Department",
            GoalType: "GoalType",
            Industry: "Industry",
            IndustryConfiguration: "IndustryConfiguration",
            InvestmentType: "InvestmentType",
            KPI: "KPI",
            KPIUoM: "KPIUoM",
            MarketDynamicAssessment: "MarketDynamicAssessment",
            MarketDynamicAssessmentQuestion: "MarketDynamicAssessmentQuestion",
            MarketIntelligenceInfo: "MarketIntelligenceInfo",
            MarketIntelligenceReport: "MarketIntelligenceReport",
            MarketIntelligenceReportInfo: "MarketIntelligenceReportInfo",
            PhasesToTools: "PhasesToTools",
            ProcessPhase: "ProcessPhase",
            ProcessSetup: "ProcessSetup",
            ProcessTemplate: "ProcessTemplate",
            Role: "Role",
            SegmentationAssessment: "SegmentationAssessment",
            SpendChannel: "SpendChannel",
            SupplierPreferencingAssessment: "SupplierPreferencingAssessment",
            SupplierPreferencingAssessmentQuestion: "SupplierPreferencingAssessmentQuestion",
            SupplyRiskAssessmentQuestion: "SupplyRiskAssessmentQuestion",
            TemplatesToTools: "TemplatesToTools",
            Tool: "Tool",
            Tools: "Tools",
            UnitOfMeasure: "UnitOfMeasure",
            ValueLever: "ValueLever",
            ValueLeverGroup: "ValueLeverGroup",
            ValueLeverGroupToLever: "ValueLeverGroupToLever",
            VersioningConfiguration: "VersioningConfiguration",
            VersioningTools: "VersioningTools"
        }
    },
    "masterdataSnapshot": {
        color: "1dc962",
        file: "masterdataSnapshot-schema.cds",
        entities: {
            BusinessImpactAssessmentQuestionSnapshot: "BusinessImpactAssessmentQuestionSnapshot",
            MarketDynamicAssessmentQuestionSnapshot: "MarketDynamicAssessmentQuestionSnapshot",
            MarketDynamicAssessmentSnapshot: "MarketDynamicAssessmentSnapshot",
            SegmentationAssessmentSnapshot: "SegmentationAssessmentSnapshot",
            SupplierPreferencingAssessmentQuestionSnapshot: "SupplierPreferencingAssessmentQuestionSnapshot",
            SupplierPreferencingAssessmentSnapshot: "SupplierPreferencingAssessmentSnapshot",
            SupplyRiskAssessmentQuestionSnapshot: "SupplyRiskAssessmentQuestionSnapshot"
        }
    },
    "mdapp": {
        color: "5c8ed6",
        file: "mdapp-schema.cds",
        entities: {
            CurrencyCodes: "CurrencyCodes"
        }
    },
    "migration": {
        color: "f42563",
        file: "migration-schema.cds",
        entities: {
            ElementControl: "ElementControl",
            MigrationControl: "MigrationControl",
            ScriptControl: "ScriptControl"
        }
    },
    "notification": {
        color: "f5a13d",
        file: "notification-schema.cds",
        entities: {
            NotificationConfiguration: "NotificationConfiguration",
            NotificationType: "NotificationType",
            TriggerType: "TriggerType",
            ANSResourceHash: "ANSResourceHash"
        }
    },
    "operationalReporting": {
        color: "0bdada",
        file: "operationalReporting-schema.cds",
        entities: {
            CategoryForOperationalPlanView: "CategoryForOperationalPlanView",
            CategoryProfiles: "CategoryProfiles",
            CategoryStrategyAndPlanDocuments: "CategoryStrategyAndPlanDocuments",
            Stakeholder: "Stakeholder",
            SupplierData: "SupplierData",
            Team: "Team"
        }
    },
    "pdm": {
        color: "7df53d",
        file: "pdm-model.cds",
        entities: {
            PdmCategoryPlanView: "PdmCategoryPlanView",
            PdmCategoryView: "PdmCategoryView",
            PdmStakeholderView: "PdmStakeholderView",
            PdmTeamView: "PdmTeamView",
            PdmUsersView: "PdmUsersView"
        }
    },
    "plannedSpend": {
        color: "5cd67a",
        file: "plannedSpend-schema.cds",
        entities: {
            PlannedSpend: "PlannedSpend"
        }
    },
    "prismIngestion": {
        color: "33b5cc",
        file: "prismIngestion-schema.cds",
        entities: {
            PrismEntitySubscription: "PrismEntitySubscription",
            UploadedData: "UploadedData"
        }
    },
    "processSetupSnapshot": {
        color: "29df20",
        file: "processSetupSnapshot.cds",
        entities: {
            PhasesToToolsSnapshot: "PhasesToToolsSnapshot",
            ProcessPhaseSnapshot: "ProcessPhaseSnapshot",
            ProcessSetupSnapshot: "ProcessSetupSnapshot",
            ProcessTemplateSnapshot: "ProcessTemplateSnapshot",
            TemplatesToToolsSnapshot: "TemplatesToToolsSnapshot"
        }
    },
    "region": {
        color: "3da2f5",
        file: "region-schema.cds",
        entities: {
            Region: "Region",
            RegionImportResponse: "RegionImportResponse",
            RegionPreview: "RegionPreview",
            RegionValidation: "RegionValidation",
            SubDivisionIso: "SubDivisionIso"
        }
    },
    "requirement": {
        color: "2050df",
        file: "requirement-schema.cds",
        entities: {
            Requirement: "Requirement"
        }
    },
    "riskAssessment": {
        color: "0df28b",
        file: "riskAssessment-schema.cds",
        entities: {
            PlanWithNewRisksLog: "PlanWithNewRisksLog",
            RiskAssessment: "RiskAssessment",
            RiskLevel: "RiskLevel",
            RiskType: "RiskType"
        }
    },
    "segmentation": {
        color: "49b82e",
        file: "segmentation-schema.cds",
        entities: {
            BusinessImpactAnswer: "BusinessImpactAnswer",
            Segmentation: "Segmentation",
            SupplyRiskAnswer: "SupplyRiskAnswer"
        }
    },
    "spendChannels": {
        color: "625cd6",
        file: "spendChannels-schema.cds",
        entities: {
            SpendChannels: "SpendChannels"
        }
    },
    "stakeholder": {
        color: "f53dc7",
        file: "stakeholder-schema.cds",
        entities: {
            UnboundUser: "UnboundUser"
        }
    },
    "subscription": {
        color: "5d0df2",
        file: "subscription-schema.cds",
        entities: {
            SubscriptionParameter: "SubscriptionParameter"
        }
    },
    "supplier": {
        color: "b04de5",
        file: "supplier-schema.cds",
        entities: {
            Supplier: "Supplier"
        }
    },
    "supplierExt": {
        color: "c433cc",
        file: "supplierExt-schema.cds",
        entities: {
            SupplierDetails: "SupplierDetails",
            SupplierPreferencingAnswer: "SupplierPreferencingAnswer",
            SWOT: "SWOT"
        }
    },
    "swot": {
        color: "d65c9e",
        file: "swot-schema.cds",
        entities: {
            SWOT: "SWOT",
            SWOTType: "SWOTType"
        }
    },
    "systemConfiguration": {
        color: "b82e81",
        file: "systemConfiguration-schema.cds",
        entities: {
            DomainMapping: "DomainMapping",
            SACStoryMapping: "SACStoryMapping",
            SACStoryMappingModel: "SACStoryMappingModel",
            SpendCardAndStoryMapping: "SpendCardAndStoryMapping",
            SpendPeriodConfiguration: "SpendPeriodConfiguration",
            StoryMappingModel: "StoryMappingModel"
        }
    },
    "taxonomy": {
        color: "b82e2e",
        file: "schema.cds",
        entities: {
            ActiveUserView: "ActiveUserView",
            Category: "Category",
            CategoryAccess: "CategoryAccess",
            CategoryCoreData: "CategoryCoreData",
            CategoryPlanUserView: "CategoryPlanUserView",
            CategoryPreview: "CategoryPreview",
            CategorySequences: "CategorySequences",
            Classification: "Classification",
            ClassificationCodeToCategoryResponse: "ClassificationCodeToCategoryResponse",
            DefaultCategories: "DefaultCategories",
            Email: "Email",
            EmailBackup: "EmailBackup",
            ErrorMessage: "ErrorMessage",
            Files: "Files",
            InitialCategoryTree: "InitialCategoryTree",
            JupiterUserData: "JupiterUserData",
            MaterialGroup: "MaterialGroup",
            OperationHistory: "OperationHistory",
            PublishStatus: "PublishStatus",
            ReloadCategoryTree: "ReloadCategoryTree",
            RuleEnforcedDomain: "RuleEnforcedDomain",
            User: "User",
            UserBackup: "UserBackup",
            UserView: "UserView"
        }
    },
    "team": {
        color: "3dd6b0",
        file: "team-schema.cds",
        entities: {
            Team: "Team"
        }
    },
    "toolkit": {
        color: "96cc33",
        file: "toolkit-schema.cds",
        entities: {
            OutdatedTools: "OutdatedTools",
            ToolData: "ToolData",
            ToolDocuments: "ToolDocuments",
            ToolkitDocuments: "ToolkitDocuments"
        }
    },
    "versioning": {
        color: "df2076",
        file: "versioning-schema.cds",
        entities: {
            VersionChangelog: "VersionChangelog",
            VersionMap: "VersionMap"
        }
    },
    "workbench": {
        color: "b1da0b",
        file: "workbench-schema.cds",
        entities: {
            AribaOpenAPIViewInfo: "AribaOpenAPIViewInfo",
            LayoutCustomization: "LayoutCustomization",
            ManifestLeft: "ManifestLeft",
            ManifestMiddle: "ManifestMiddle",
            ManifestRight: "ManifestRight"
        }
    }
};

export const paths = {
    CDS_FILES: "./db/"
}
