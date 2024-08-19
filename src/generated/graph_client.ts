/* eslint-disable */export declare namespace GraphClient {  export interface Book {    author?: null | string;    title?: null | string;  }  export interface Mutation {    changeOrderStatus?: null | boolean;    createBrand?: null | boolean;    createCategory?: null | boolean;    createOrder?: null | boolean;    createProduct?: null | boolean;    createProductStock?: null | boolean;    login?: null | string;    updateBrand?: null | boolean;    updateCategory?: null | boolean;    updateProduct?: null | boolean;    updateProductStock?: null | boolean;  }  export interface Query {    books?: Book[] | null;    brand?: null | Brand;    brandList?: Brand[] | null;    category?: null | Category;    categoryList?: null | any;    generateTokenOrder?: null | string;    me?: null | User;    order?: null | Order;    orderList?: Order[] | null;    product?: null | Product;    productList?: Product[] | null;    productStock?: null | ProductStock;    productStockList?: ProductStock[] | null;    user?: null | User;    userList?: User[] | null;  }  export interface User {    contact?: null | string;    createdDate?: null | string;    display?: null | string;    gender?: null | string;    id: number;    isActive?: null | boolean;    role?: null | Role;  }  export interface Role {    id?: null | number;    name?: null | string;  }  export type Gender = "MALE" | "FEMALE" | "OTHER";  export interface ProductStockInput {    location?: null | string;    productId?: null | number;    qty?: null | number;  }  export interface ProductStock {    id?: null | number;    location?: null | string;    product?: null | Product;    qty?: null | number;  }  export interface ProductInput {    addons?: AddonInput[] | null;    category?: null | number;    code?: null | string;    description?: null | string;    images?: null | string;    integrate?: IntegrateInput[] | null;    sku?: SKUInput[] | null;    stockAlter?: null | number;    title?: null | string;    type?: TYPE_PRODUCT[] | null;  }  export interface AddonInput {    id?: null | number;    isRequired?: null | boolean;    name?: null | string;    value?: null | string;  }  export interface SKUInput {    discount?: null | number;    id?: null | number;    name?: null | string;    price?: null | number;    unit?: null | string;  }  export interface IntegrateInput {    id?: null | number;    integrateId?: null | number;    productId?: null | number;    qty?: null | string;  }  export interface Product {    addons?: AddonProduct[] | null;    category?: null | Category;    code?: null | string;    description?: null | string;    id?: null | number;    images?: null | string;    integrates?: Integrate[] | null;    sku?: SKU[] | null;    stockAlter?: null | number;    title?: null | string;    type?: TYPE_PRODUCT[] | null;  }  export interface AddonProduct {    id?: null | number;    isRequired?: null | boolean;    name?: null | string;    value?: null | string;  }  export interface SKU {    discount?: null | number;    id?: null | number;    name?: null | string;    price?: null | number;    unit?: null | string;  }  export interface Integrate {    id?: null | number;    integrate?: null | Product;    product?: null | Product;    qty?: null | string;  }  export interface FilterProduct {    category?: number[] | null;    isLowStock?: null | boolean;    type?: TYPE_PRODUCT[] | null;  }  export type TYPE_PRODUCT = "PRODUCTION" | "RAW" | "ADDON" | "FREEZING" | "SECOND_HAND" | "FREE";  export interface Order {    address?: null | string;    id?: null | number;    items?: OrderItem[] | null;    name?: null | string;    paid?: null | string;    set?: null | string;    status?: null | StatusOrder;    total?: null | string;    uuid?: null | string;  }  export interface OrderItem {    discount?: null | number;    id?: null | number;    price?: null | number;    qty?: null | number;    sku?: null | SKU;    status?: null | StatusOrderItem;  }  export interface OrderInput {    address?: null | string;    carts?: CartItemInput[] | null;    name?: null | string;    set?: null | string;    uuid?: null | string;  }  export interface CartItemInput {    addons?: null | string;    discount?: null | number;    price?: null | number;    productId?: null | number;    qty?: null | number;    remark?: null | string;    skuId?: null | number;  }  export interface ChangeOrderInput {    id?: null | number;    itemStatus?: null | StatusOrderItem;    orderId: number;    status?: null | StatusOrder;  }  export type StatusOrder = "PENDING" | "VERIFY" | "DELIVERY" | "CHECKOUT" | "CANCELLED";  export type StatusOrderItem = "PENDING" | "MAKING" | "OUT_OF_STOCK" | "REQUEST_CHANGE" | "COMPLETED";  export interface CategoryInput {    name?: null | string;    root?: null | number;  }  export interface Category {    id?: null | number;    name?: null | string;    root?: null | number;  }  export interface BrandInput {    logo?: null | string;    name?: null | string;  }  export interface Brand {    id?: null | number;    logo?: null | string;    name?: null | string;  }}