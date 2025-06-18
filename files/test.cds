namespace my.bookshop;

entity Customer {
    key ID         : UUID;
        name       : String(111);
        email      : String(255);
        orders     : Composition of many Order on orders.customer = $self;
}

entity Order {
    key ID         : UUID;
        orderDate  : Date;
        total      : Decimal(9,2);
        customer   : Association to Customer;
}