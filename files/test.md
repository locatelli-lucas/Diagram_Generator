erDiagram
Category {
  name String
  code String
  status Integer
  publishStatus PublishStatus
  parent Category
  active Boolean
  categories Category
  classifications Classification
  inactiveDate Date
  description String
  responsible User
  approver User
  segmentationCode Segmentation
  access Category
  restricted Boolean
  hasChildren Boolean
}
Classification {
  category Category
  domain String
  name String
  code String
  version String
  classificationUUID String
  logicalSystem String
  active Boolean
  mappedClassification Classification
  isCustomDomain Boolean
}
RuleEnforcedDomain {
  domain String
}
CategorySequences {
  type String
  sequenceNumber Integer
}
MaterialGroup {
  name String
  code String
}
User {
  userName String
  lastName String
  firstName String
  loginName String
  displayName String
  scimExternalId String
  active Boolean
  email String
  emails Email
  blocked Boolean
  maxDeletionDate Date
  userUuid String
}
UserBackup {
  userName String
  lastName String
  firstName String
  loginName String
  displayName String
  scimExternalId String
  active Boolean
  email String
  emails EmailBackup
  blocked Boolean
  maxDeletionDate Date
  userUuid String
}
UserView {
}
ActiveUserView {
}
CategoryPlanUserView {
  firstNamelastNameasfullName String
}
Email {
  value String
  type String
  isPrimary Boolean
  user User
}
EmailBackup {
  value String
  type String
  isPrimary Boolean
  user UserBackup
}
Files {
  content Binary
  mediaType String
  type String
  fileName String
  user User
  username String
}
DefaultCategories {
  user User
  category Category
  lastVisitedTime Time
}
CategoryPreview {
  code String
  name String
  parentCode String
  userName String
  firstName String
  lastName String
  approverName String
  firstApproverName String
  lastApproverName String
  isChanged Boolean
  isUpdated Boolean
  validType String
  messages ErrorMessage
  status Integer
  fromExcel Integer
}
ErrorMessage {
  message String
  errorCode Integer
  errorType Integer
}
ClassificationCodeToCategoryResponse {
  code String
  category Category
  typePublishStatus Integer
  typeSegmentationCode String
  typeCategoryAccess Integer
}
OperationHistory {
  operationalParam String
  operation Operation
  category Category
  operationalAt Time
  operator User
  before String
  after String
  typeOperation Integer
}
JupiterUserData {
  displayName String
  email String
  firstName String
  lastName String
  name String
  scopes String
}
InitialCategoryTree {
  categoryTree CategoryCoreData
  allCategories CategoryCoreData
}
ReloadCategoryTree {
  categoryTree CategoryCoreData
  allCategories CategoryCoreData
  categoryReloaded CategoryCoreData
}
CategoryCoreData {
  name String
  code String
  status Integer
  parent CategoryCoreData
  active Boolean
  categories CategoryCoreData
  responsible User
  approver User
  segmentationCode Segmentation
  access Category
  restricted Boolean
  hasChildren Boolean
}
  Category ||--|||{ Category : association
  Category }o--o| Classification : composition
  Category ||-- User : association
  Classification o|-- Category : association
  Classification o|--o| Classification : association
  User }o--o| Email : composition
  UserBackup }o--o| EmailBackup : composition
  Email o|-- User : association
  EmailBackup o|-- UserBackup : association
  Files ||-- User : association
  DefaultCategories o|-- User : association
  DefaultCategories o|-- Category : association
  CategoryPreview }o-- ErrorMessage : composition
  ClassificationCodeToCategoryResponse o|-- Category : association
  OperationHistory o|-- Category : association
  OperationHistory ||-- User : association
  InitialCategoryTree }|-- CategoryCoreData : association
  ReloadCategoryTree }|-- CategoryCoreData : association
  CategoryCoreData ||--|||{ CategoryCoreData : association
  CategoryCoreData ||-- User : association
