using {
    cuid,
    managed
} from '@sap/cds/common';

namespace com.sap.catman.category.artificialIntelligence;

entity ArtificialIntelligenceOutput : cuid, managed {
    model        : ModelType not null;
    featureType  : FeatureType not null;
    featureID    : UUID not null;
    parentID     : UUID;
    generatedAt  : DateTime not null;
    promptTokens : Composition of many PromptToken
                       on promptTokens.output = $self;
};

entity GeneratedArticle : cuid {
    categoryId    : String not null;
    planId        : String;
    title         : String not null;
    content       : String not null;
    generatedAt   : DateTime not null;
    tags          : array of String not null;
    model         : ModelType not null;
    color         : String;
    articleTokens : Composition of many ArticleToken
                        on articleTokens.generatedArticle = $self;
    articleId     : String;
    feature       : FeatureType;
};

entity PromptToken : cuid {
    type   : TokenType not null;
    value  : LargeString not null;
    output : Association to ArtificialIntelligenceOutput not null;
};

entity ArticleToken : cuid {
    type             : TokenType not null;
    value            : String not null;
    generatedArticle : Association to GeneratedArticle not null;
};

entity ArtificialIntelligenceConfiguration : cuid {
    active : Boolean not null;
    model  : ModelType not null;
};

entity AIFeatureConfiguration : cuid {
    active         : Boolean not null;
    enableToolData : Boolean default true;
    model          : ModelType not null;
    featureType    : FeatureType not null;
};

entity ArtificialIntelligenceTokenUsage : cuid {
    input       : Integer not null;
    output      : Integer not null;
    feature     : FeatureType not null;
    model       : ModelType not null;
    type        : ConfigurationType not null;
    generatedAt : DateTime not null;
};

entity ArtificialIntelligenceAcknowledgment : cuid, managed {
    feature    : FeatureType not null;
    version    : Integer not null;
    categoryId : String;
    value      : Boolean not null;
};

entity RegenerateControl : cuid, managed {
    feature    : FeatureType not null;
    parentId   : UUID not null;
    changes    : Composition of many ContextChange
                     on changes.control = $self;
    executed   : Boolean not null;
    executedAt : DateTime;
};

entity ContextChange : cuid {
    element   : ContextElementType not null;
    action    : ChangeActionType not null;
    control   : Association to RegenerateControl not null;
    changedAt : DateTime not null;
};

@assert.range
type TokenType          : String enum {
    CategoryName                = '{CATEGORY_NAME}';
    Language                    = '{LANGUAGE}';
    SubCategories               = '{SUB_CATEGORIES}';
    ParentCategories            = '{PARENT_CATEGORIES}';
    Industry                    = '{INDUSTRY}';
    CostComponents              = '{COST_COMPONENTS}';
    AllCostComponents           = '{ALL_COST_COMPONENTS}';
    CostStructureValue          = '{COST_STRUCTURE_VALUE}';
    SegmentationValue           = '{SEGMENTATION_VALUE}';
    Region                      = '{REGION}';
    JsonTools                   = '{JSON_TOOLS}';
    TemplateAnalysisDescription = '{TEMPLATE_ANALYSIS_DESCRIPTION}';
    CategoryStrategyTemplate    = '{CATEGORY_STRATEGY_TEMPLATE}';
    ApprovalDocSummary          = '{APPROVAL_DOC_SUMMARY}';
};

@assert.range
type ModelType          : String enum {
    ChatGpt                     = 'CHAT_GPT_4';
};

@assert.range
type FeatureType    : String enum {
    MarketDynamics              = 'MARKET_DYNAMICS';
    CostStructure               = 'COST_STRUCTURE';
    Segmentation                = 'SEGMENTATION';
    CategoryStrategy            = 'CATEGORY_STRATEGY';
    Goals                       = 'GOAL';
    BusinessRequirements        = 'BUSINESS_REQUIREMENTS';
    RelevantCostComponents      = 'RELEVANT_COST_COMPONENTS';
    Summary                     = 'SUMMARY';
    Attachments                 = 'ATTACHMENTS';
    AttachmentsInitiative       = 'ATTACHMENTS_INITIATIVE';
    CompanyPolicy               = 'COMPANY_POLICY';
    LawsAndRegulation           = 'LAW_REGULATION';
};

@assert.range
type ArticleType        : String enum {
    PreClick                    = 'PRE_CLICK';
    PostClick                   = 'POST_CLICK';
};

@assert.range
type ConfigurationType  : String enum {
    ArticleData                 = 'ARTICLE_DATA';
    FeatureData                 = 'FEATURE_DATA';
};

@assert.range
type ContextElementType : String enum {
    MarketDynamics              = 'MARKET_DYNAMICS';
    CostStructure               = 'COST_STRUCTURE';
    Segmentation                = 'SEGMENTATION';
    BusinessRequirements        = 'BUSINESS_REQUIREMENTS';
    Goals                       = 'GOALS';
    CategoryStrategies          = 'CATEGORY_STRATEGIES';
    Initiatives                 = 'INITIATIVES';
    ValueLevers                 = 'VALUE_LEVERS';
};

@assert.range
type ChangeActionType   : String enum {
    Create                      = 'CREATE';
    Update                      = 'UPDATE';
    Delete                      = 'DELETE';
};