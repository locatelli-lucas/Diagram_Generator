---
config:
  look: neo
  layout: elk
  theme: dark
---
classDiagram
class ArtificialIntelligenceOutput {
  model : ModelType not null
  featureType : FeatureType not null
  featureID : UUID
  parentID : UUID
  generatedAt : Date
  promptTokens : PromptToken
}
class GeneratedArticle {
  categoryId : String
  planId : String
  title : String
  content : String
  generatedAt : Date
  tags : String
  model : ModelType not null
  color : String
  articleTokens : ArticleToken
  articleId : String
  feature : FeatureType
}
class PromptToken {
  type : TokenType not null
  value : String
  output : ArtificialIntelligenceOutput
}
class ArticleToken {
  type : TokenType not null
  value : String
  generatedArticle : GeneratedArticle
}
class ArtificialIntelligenceConfiguration {
  active : Boolean
  model : ModelType not null
}
class AIFeatureConfiguration {
  active : Boolean
  enableToolData : Boolean
  model : ModelType not null
  featureType : FeatureType not null
}
class ArtificialIntelligenceTokenUsage {
  input : Integer
  output : Integer
  feature : FeatureType not null
  model : ModelType not null
  type : ConfigurationType not null
  generatedAt : Date
}
class ArtificialIntelligenceAcknowledgment {
  feature : FeatureType not null
  version : Integer
  categoryId : String
  value : Boolean
}
class RegenerateControl {
  feature : FeatureType not null
  parentId : UUID
  changes : ContextChange
  executed : Boolean
  executedAt : Date
}
class ContextChange {
  element : ContextElementType not null
  action : ChangeActionType not null
  control : RegenerateControl
  changedAt : Date
  typeTokenType : String
  typeModelType : String
  typeFeatureType : String
  typeArticleType : String
  typeConfigurationType : String
  typeContextElementType : String
  typeChangeActionType : String
}
  ArtificialIntelligenceOutput "1" *-- "N" PromptToken : composes
  GeneratedArticle "1" *-- "N" ArticleToken : composes
  PromptToken "1" --> "1" ArtificialIntelligenceOutput : associates to
  ArticleToken "1" --> "1" GeneratedArticle : associates to
  RegenerateControl "1" *-- "N" ContextChange : composes
  ContextChange "1" --> "1" RegenerateControl : associates to
