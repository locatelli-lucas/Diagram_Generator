erDiagram
Customer {
  ID  UUID;
  name  String;
  email  String;
  orders  Composition of many Order on orders.customer = $self;
}
Order {
  ID  UUID;
  orderDate  Date;
  total  Decimal;
  customer  Association to Customer;
}
