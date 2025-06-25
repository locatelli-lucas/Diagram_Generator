erDiagram
Customer {
  ID  UUID
  name  String
  email  String
  orders Order
}
Order {
  ID  UUID
  orderDate  Date
  total  Decimal
  customer Customer
}
  Customer }o--o| Order : composition
