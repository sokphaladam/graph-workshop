/* eslint-disable */export declare namespace GraphClient {  export interface Book {    author?: null | string;    title?: null | string;  }  export interface Mutation {    addOrderItem?: null | boolean;    changeOrderStatus?: null | boolean;    checkAttendance?: null | boolean;    createBank?: null | boolean;    createBrand?: null | boolean;    createCategory?: null | boolean;    createDelivery?: null | boolean;    createOrder?: null | boolean;    createPosition?: null | boolean;    createProduct?: null | boolean;    createProductStock?: null | boolean;    createUser?: null | boolean;    decreaseOrderItem?: null | boolean;    generateTableSet?: null | boolean;    generateTokenOrder?: null | string;    increaseOrderItem?: null | boolean;    login?: null | string;    markOrderItemStatus?: null | boolean;    signatureOrder?: null | boolean;    testSubscription?: null | boolean;    updateBank?: null | boolean;    updateBrand?: null | boolean;    updateCategory?: null | boolean;    updateDelivery?: null | boolean;    updatePosition?: null | boolean;    updateProduct?: null | boolean;    updateProductStock?: null | boolean;    updateSetting?: null | boolean;    updateUser?: null | boolean;    verifyOtpOrder?: null | boolean;  }  export interface Subscription {    newOrderPending?: null | string;    orderSubscript?: null | any;  }  export interface Query {    bankInfo?: null | BankInfo;    books?: Book[] | null;    brand?: null | Brand;    brandList?: Brand[] | null;    category?: null | Category;    categoryList?: null | any;    deliveryById?: null | Delivery;    deliveryList?: Delivery[] | null;    getAttendanceAdmin?: null | any;    getAttendanceStaff?: Attendance[] | null;    getAttendanceStaffToday?: null | Attendance;    getbankList?: BankInfo[] | null;    getLeaveAdmin?: null | any;    getPositionList?: Position[] | null;    me?: null | User;    order?: null | Order;    orderList?: Order[] | null;    position?: null | Position;    product?: null | Product;    productList?: Product[] | null;    productStock?: null | ProductStock;    productStockList?: ProductStock[] | null;    roleList?: Role[] | null;    settingList?: Setting[] | null;    tableSet?: null | TableSet;    tableSetList?: TableSet[] | null;    user?: null | User;    userList?: User[] | null;  }  export interface UserInput {    bankAcc?: null | string;    bankName?: null | string;    bankType?: null | string;    baseSalary?: null | string;    contact?: null | string;    createdDate?: null | string;    display?: null | string;    dob?: null | string;    gender?: null | string;    isActive?: null | boolean;    ownerId?: null | string;    password?: null | string;    position?: null | string;    profile?: null | string;    roleId?: null | number;    startingAt?: null | string;    type?: null | string;    username?: null | string;  }  export interface User {    bankAcc?: null | string;    bankName?: null | string;    bankType?: null | string;    baseSalary?: null | string;    contact?: null | string;    createdDate?: null | string;    display?: null | string;    dob?: null | string;    gender?: null | string;    id: number;    isActive?: null | boolean;    ownerId?: null | string;    password?: null | string;    position?: null | string;    profile?: null | string;    role?: null | Role;    startingAt?: null | string;    type?: null | string;    username?: null | string;  }  export interface Role {    id?: null | number;    name?: null | string;  }  export type Gender = "MALE" | "FEMALE" | "OTHER";  export interface Position {    createdDate?: null | string;    id?: null | number;    name?: null | string;    updatedDate?: null | string;  }  export interface TableSet {    order?: null | Order;    set?: null | number;  }  export interface ProductStockInput {    location?: null | string;    productId?: null | number;    qty?: null | number;  }  export interface ProductStock {    id?: null | number;    location?: null | string;    product?: null | Product;    qty?: null | number;  }  export interface Setting {    option?: null | string;    type?: null | string;    value?: null | string;  }  export interface ProductInput {    addons?: AddonInput[] | null;    category?: null | number;    code?: null | string;    description?: null | string;    images?: null | string;    integrate?: IntegrateInput[] | null;    sku?: SKUInput[] | null;    stockAlter?: null | number;    title?: null | string;    type?: TYPE_PRODUCT[] | null;  }  export interface AddonInput {    id?: null | number;    isRequired?: null | boolean;    name?: null | string;    value?: null | string;  }  export interface SKUInput {    discount?: null | number;    id?: null | number;    name?: null | string;    price?: null | number;    unit?: null | string;  }  export interface IntegrateInput {    id?: null | number;    integrateId?: null | number;    productId?: null | number;    qty?: null | string;  }  export interface Product {    addons?: AddonProduct[] | null;    category?: null | Category;    code?: null | string;    description?: null | string;    id?: null | number;    images?: null | string;    integrates?: Integrate[] | null;    sku?: SKU[] | null;    stockAlter?: null | number;    title?: null | string;    type?: TYPE_PRODUCT[] | null;  }  export interface AddonProduct {    id?: null | number;    isRequired?: null | boolean;    name?: null | string;    value?: null | string;  }  export interface SKU {    discount?: null | number;    id?: null | number;    name?: null | string;    price?: null | number;    unit?: null | string;  }  export interface Integrate {    id?: null | number;    integrate?: null | Product;    product?: null | Product;    qty?: null | string;  }  export interface FilterProduct {    category?: number[] | null;    isLowStock?: null | boolean;    type?: TYPE_PRODUCT[] | null;  }  export type TYPE_PRODUCT = "PRODUCTION" | "RAW" | "ADDON" | "FREEZING" | "SECOND_HAND" | "FREE";  export interface Order {    address?: null | string;    code?: null | string;    delivery?: null | Delivery;    deliveryCode?: null | string;    id?: null | number;    items?: OrderItem[] | null;    log?: OrderLog[] | null;    name?: null | string;    note?: null | string;    paid?: null | string;    set?: null | string;    status?: null | StatusOrder;    total?: null | string;    uuid?: null | string;    vat?: null | string;  }  export interface OrderLog {    by?: null | User;    date?: null | string;    text?: null | string;  }  export interface OrderItem {    addons?: null | string;    discount?: null | number;    id?: null | number;    price?: null | number;    product?: null | Product;    qty?: null | number;    remark?: null | string;    sku?: null | SKU;    status?: null | StatusOrderItem;  }  export interface OrderInput {    address?: null | string;    carts?: CartItemInput[] | null;    name?: null | string;    set?: null | string;    uuid?: null | string;  }  export interface CartItemInput {    addons?: null | string;    discount?: null | number;    price?: null | number;    productId?: null | number;    qty?: null | number;    remark?: null | string;    skuId?: null | number;  }  export interface ChangeOrderInput {    amount?: null | string;    deliverPickupCode?: null | string;    deliverPickupId?: null | number;    id?: null | number;    invoice?: null | number;    itemStatus?: null | StatusOrderItem;    orderId: number;    reason?: null | string;    status?: null | StatusOrder;  }  export type StatusOrder = "PENDING" | "VERIFY" | "DELIVERY" | "CHECKOUT" | "CANCELLED";  export type StatusOrderItem = "PENDING" | "MAKING" | "OUT_OF_STOCK" | "REQUEST_CHANGE" | "COMPLETED" | "DELETED";  export type OrderViewBy = "KITCHEN" | "ADMIN" | "USER";  export interface Delivery {    contact?: null | string;    id?: null | number;    name?: null | string;  }  export interface DeliveryInput {    contact?: null | string;    name?: null | string;  }  export interface CategoryInput {    name?: null | string;    root?: null | number;  }  export interface Category {    id?: null | number;    name?: null | string;    root?: null | number;  }  export interface BrandInput {    logo?: null | string;    name?: null | string;  }  export interface Brand {    id?: null | number;    logo?: null | string;    name?: null | string;  }  export interface BankInfo {    createdDate?: null | string;    id?: null | number;    name?: null | string;    phone?: null | string;    updatedDate?: null | string;  }  export interface Attendance {    checkDate?: null | string;    checkIn?: null | string;    checkOut?: null | string;    id?: null | number;    overTimeIn?: null | string;    overTimeOut?: null | string;    user?: null | User;  }}