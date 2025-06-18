erDiagram
Customer {
  keyID  UUID;
  name  String(111);
  email  String(255);
  orders  Composition of many Order on orders.customer = $self;
   undefined
Order {
  keyID  UUID;
  orderDate  Date;
  total  Decimal(9,2);
  customer  Association to Customer;
   undefined
