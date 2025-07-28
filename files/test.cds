using {cuid, managed} from '@sap/cds/common';

namespace com.sap.catman.taxonomy;

@assert.unique : {
    name : [name],
    code : [code]
}

@cds.search: {
    ID: false,
    name,
    code,
    classifications.name,
    classifications.code,
    responsible.userName,
    approver.userName,
}

entity Category : cuid {
    name             : String(255) not null;
    code             : String(20) not null;
    status           : Integer not null default 0; // 0 new, 1 published, 2 changed and 3 inactive
    publishStatus    : PublishStatus not null default 0; // 0 no status, 1 published, 2 pending publish, 3 publishing, 4 error
    parent           : Association to one Category;
    active           : Boolean not null default true; //identify if the category is still active
    categories       : Association to many Category
                           on categories.parent = $self;
    classifications  : Composition of many Classification
                           on classifications.category = $self;
    inactiveDate     : Date default null;
    description      : localized String(1000) default null;
    responsible      : Association to one User;
    approver         : Association to one User;
    segmentationCode : SegmentationCode;
    access    : CategoryAccess not null default 0; // 0 means eveny one can view, 1 means only team membeers can view, 2 means team and stakeholder members can view
    virtual restricted : Boolean;
    virtual hasChildren: Boolean default false;
}

@assert.unique : {code : [
    domain,
    version,
    code,
    category
]}

entity Classification : cuid {
    category             : Association to Category not null;
    domain               : String(30) not null; // UNSPC, Material Group, E-Class, etc.
    name                 : String(300) not null;
    code                 : String(30) not null;
    version              : String(20) not null; // UNSPSC version: 9.05, etc.
    // UUID in classification service DB if it is from there.
    classificationUUID   : String(36);
    // For multiple ERPs.
    logicalSystem        : String(50);
    active               : Boolean default true;
    // UNSPSC to Material group mapping
    mappedClassification : Association to Classification;
    isCustomDomain       : Boolean default false;
}


entity RuleEnforcedDomain: cuid, managed {
    domain                  : String(100);
}

entity CategorySequences: managed {
    key type           : String(30);
        sequenceNumber : Integer64;
}

@cds.persistence.skip
entity MaterialGroup {
    name : String(300);
    code : String(30);
}

@assert.unique : {name : [userName]}
entity User : cuid {
    userName  : String(200);
    lastName  : String(100);
    firstName : String(100);
    loginName : String(200);
    displayName : String(200);
    scimExternalId: String(256);
    createdAt  : Timestamp @cds.on.insert : $now;
    modifiedAt : Timestamp @cds.on.insert : $now  @cds.on.update : $now;
    active: Boolean;
    email: String(200); //Primary email
    emails: Composition of many Email on emails.user = $self;
    blocked    : Boolean default false;
    maxDeletionDate : Date;
    userUuid : String(36);
}

@assert.unique : {name : [userName]}
entity UserBackup : cuid {
    userName  : String(200);
    lastName  : String(100);
    firstName : String(100);
    loginName : String(200);
    displayName : String(200);
    scimExternalId: String(256);
    createdAt  : Timestamp @cds.on.insert : $now;
    modifiedAt : Timestamp @cds.on.insert : $now  @cds.on.update : $now;
    active: Boolean;
    email: String(200); //Primary email
    emails: Composition of many EmailBackup on emails.user = $self;
    blocked    : Boolean default false;
    maxDeletionDate : Date;
    userUuid : String(36);
}

entity UserView              as
    select from User {
        *
    };

entity ActiveUserView              as
    select from User {
        key ID, firstName, lastName, userName, email
    }  where blocked != true and active = true;

entity CategoryPlanUserView as
    select from User {
        key ID,
        firstName,
        lastName,
        userName,
        email,
        scimExternalId,
        firstName || ' ' || lastName as fullName : String
    };

entity Email {
    key value : String;
    type : String;
    isPrimary : Boolean;
    user : Association to User;
}

entity EmailBackup {
    key value : String;
    type : String;
    isPrimary : Boolean;
    user : Association to UserBackup;
}

@assert.unique : {userAndType : [
    user,
    type
]}
entity Files : cuid, managed {
    @Core.MediaType   : mediaType
    content   : LargeBinary;
    @Core.IsMediaType : true
    mediaType : String(100);
    type      : String(60);
    fileName  : String(300);
    user      : Association to one User;
    username  : String default null;
}


entity DefaultCategories : cuid {
    user      : Association to User;
    category      : Association to Category;
    lastVisitedTime : Timestamp;
}

@cds.persistence.skip
entity CategoryPreview : cuid {
    code       : String(20);
    name       : String(255);
    parentCode : String(20);
    userName   : String(100);
    firstName  : String(50);
    lastName   : String(50);
    approverName   : String(100);
    firstApproverName  : String(50);
    lastApproverName   : String(50);
    isChanged  : Boolean;
    isUpdated  : Boolean;
    validType  : String(50); // to check code, name or userName is reach max length
    messages   : Composition of many ErrorMessage;
    status     : Integer;
    fromExcel  : Integer; // 0 excel 1 db
}

@cds.persistence.skip
entity ErrorMessage : cuid {
    message   : String(200);
    errorCode : Integer;
    errorType : Integer; // 0 error 1 warning
}

@cds.persistence.skip
entity ClassificationCodeToCategoryResponse {
    code : String(30);
    category : Association to Category;
}

@assert.range
type PublishStatus : Integer enum {
    NoStatus        = 0;
    Published       = 1;
    PendingPublish  = 2;
    Publishing      = 3;
    Error           = 4;
}

@assert.range
type SegmentationCode : String(2) enum {
    Strategic  = 'SG';
    Bottleneck = 'BN';
    Leverage   = 'LG';
    Routine    = 'RT';
}

type CategoryAccess : Integer enum {
    EveryCanView = 0;
    OnlyTeamCanView = 1;
    TeamAndStakeholderCanView = 2;
}

entity OperationHistory : cuid {
    operationalParam     : String(255);
    operation            : Operation;
    category             : Association to Category not null;
    operationalAt        : Timestamp;
    operator             : Association to one User;
    before               : String(255);
    after                : String(255);
}

type Operation : Integer enum {
    CreateCategory = 0;
    EditCategory = 1;
    InactivateCategory = 2;
    PublishCategory = 3;
    ActivateCategory = 4;
    AddClassifications = 5;
    UnmapClassifications = 6;
    AddClassificationMappings = 7;
    UnmapClassificationMappings = 8;
}

@cds.persistence.skip
entity JupiterUserData : managed {
    displayName: String;
    email: String;
    firstName: String;
    lastName: String;
    name: String;
    scopes: Array of String;
}

@cds.persistence.skip
entity InitialCategoryTree {
    categoryTree: Association to many CategoryCoreData;
    allCategories: Association to many CategoryCoreData;
}

@cds.persistence.skip
entity ReloadCategoryTree {
    categoryTree: Association to many CategoryCoreData;
    allCategories: Association to many CategoryCoreData;
    categoryReloaded: Association to one CategoryCoreData;
}

@cds.persistence.skip
entity CategoryCoreData : cuid {
    name             : String(255) not null;
    code             : String(20) not null;
    status           : Integer not null default 0; // MDI publish status. 0 is unpublished and 1 is published
    parent           : Association to one CategoryCoreData;
    active           : Boolean not null default true; //identify if the category is still active
    categories       : Association to many CategoryCoreData
                           on categories.parent = $self;
    responsible      : Association to one User;
    approver         : Association to one User;
    segmentationCode : SegmentationCode;
    access    : CategoryAccess not null default 0; // 0 means eveny one can view, 1 means only team membeers can view, 2 means team and stakeholder members can view
    virtual restricted : Boolean;
    virtual hasChildren: Boolean default false;
}