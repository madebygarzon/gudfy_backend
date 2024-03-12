export declare module "@medusajs/medusa/dist/models/store" {
  declare interface Store {
    members?: Customer[];
    products?: Product[];
  }
}

export declare module "@medusajs/medusa/dist/models/customer" {
  declare interface Customer {
    store_id?: string;
    store?: Store;
    role_id?: number;
    customerRole?: CustomerRole;
    sellerapplications?: SellerApplication[];
  }
}

export declare module "@medusajs/medusa/dist/models/product" {
  declare interface Product {
    store_id?: string;
    store?: Store;
  }
}
