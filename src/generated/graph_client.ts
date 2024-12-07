/* eslint-disable */export declare namespace GraphClient {  export interface Book {    author?: null | string;    title?: null | string;  }  export interface Mutation {    addDiscountOrder?: null | boolean;    addOrderItem?: null | boolean;    changeOrderStatus?: null | boolean;    checkAttendance?: null | boolean;    checkProductCode?: null | boolean;    createBank?: null | boolean;    createBrand?: null | boolean;    createCategory?: null | boolean;    createDelivery?: null | boolean;    createHoliday?: null | boolean;    createLeave?: null | boolean;    createOrder?: null | boolean;    createOrderSchedule?: null | boolean;    createOverTime?: null | boolean;    createPosition?: null | boolean;    createProduct?: null | boolean;    createProductStock?: null | boolean;    createShift?: null | boolean;    createUser?: null | boolean;    decreaseOrderItem?: null | boolean;    deleteOrderSchedule?: null | boolean;    generateTableSet?: null | boolean;    generateTokenOrder?: null | string;    increaseOrderItem?: null | boolean;    login?: null | string;    markOrderItemStatus?: null | boolean;    peopleInOrder?: null | boolean;    resetPassword?: null | boolean;    setTypePaymentOrder?: null | boolean;    signatureOrder?: null | boolean;    swapOrderTable?: null | boolean;    testSubscription?: null | boolean;    updateBank?: null | boolean;    updateBrand?: null | boolean;    updateCategory?: null | boolean;    updateCategoryIndex?: null | boolean;    updateDelivery?: null | boolean;    updateHoliday?: null | boolean;    updateLeave?: null | boolean;    updateLeaveStatus?: null | boolean;    updateOrderSchedule?: null | boolean;    updateOverTime?: null | boolean;    updateOverTimeStatus?: null | boolean;    updatePosition?: null | boolean;    updateProduct?: null | boolean;    updateProductStock?: null | boolean;    updateSetting?: null | boolean;    updateShift?: null | boolean;    updateStatusProduct?: null | boolean;    updateUser?: null | boolean;    verifyOtpOrder?: null | boolean;  }  export interface Subscription {    newOrderPending?: null | string;    orderSubscript?: null | any;  }  export interface Query {    activityStaff?: null | any;    attendanceListAdmin?: Attendance[] | null;    attendanceStaff?: Attendance[] | null;    bankInfo?: null | BankInfo;    books?: Book[] | null;    brand?: null | Brand;    brandList?: Brand[] | null;    category?: null | Category;    categoryList?: null | any;    checkHaveOpenShiftToday?: null | boolean;    deliveryById?: null | Delivery;    deliveryList?: Delivery[] | null;    getAttendanceStaff?: Attendance[] | null;    getAttendanceStaffToday?: null | Attendance;    getbankList?: BankInfo[] | null;    getLeaveAdmin?: null | any;    getPositionList?: Position[] | null;    getSummaryAttendanceStaff?: null | any;    holiday?: null | Holiday;    holidayList?: Holiday[] | null;    leave?: null | Leave;    leaveList?: Leave[] | null;    me?: null | User;    order?: null | Order;    orderBalanceSummary?: null | any;    orderItem?: null | any;    orderList?: Order[] | null;    orderSchedule?: null | OrderSchedule;    orderScheduleList?: OrderSchedule[] | null;    overTime?: null | OverTime;    overTimeList?: OverTime[] | null;    position?: null | Position;    product?: null | Product;    productList?: Product[] | null;    productStock?: null | ProductStock;    productStockList?: ProductStock[] | null;    reportSaleByDay?: null | any;    reportSaleProduct?: null | any;    reportStaffPayroll?: null | any;    roleList?: Role[] | null;    settingList?: Setting[] | null;    shiftById?: null | Shift;    shiftList?: Shift[] | null;    tableSet?: null | TableSet;    tableSetList?: TableSet[] | null;    topProductSell?: ProductSell[] | null;    user?: null | User;    userList?: User[] | null;  }  export interface UserInput {    bankAcc?: null | string;    bankName?: null | string;    bankType?: null | string;    baseSalary?: null | string;    contact?: null | string;    createdDate?: null | string;    display?: null | string;    dob?: null | string;    fromTime?: null | string;    gender?: null | string;    isActive?: null | boolean;    ownerId?: null | string;    password?: null | string;    position?: null | string;    profile?: null | string;    roleId?: null | number;    startingAt?: null | string;    toTime?: null | string;    type?: null | string;    username?: null | string;  }  export interface User {    bankAcc?: null | string;    bankName?: null | string;    bankType?: null | string;    baseSalary?: null | string;    contact?: null | string;    createdDate?: null | string;    display?: null | string;    dob?: null | string;    fromTime?: null | string;    gender?: null | string;    id: number;    isActive?: null | boolean;    ownerId?: null | string;    password?: null | string;    position?: null | string;    profile?: null | string;    role?: null | Role;    startingAt?: null | string;    toTime?: null | string;    type?: null | string;    username?: null | string;  }  export interface Role {    id?: null | number;    name?: null | string;  }  export type Gender = "MALE" | "FEMALE" | "OTHER";  export interface Position {    createdDate?: null | string;    id?: null | number;    name?: null | string;    updatedDate?: null | string;  }  export interface TableSet {    fake?: null | boolean;    order?: null | Order;    set?: null | number;  }  export interface ProductStockInput {    location?: null | string;    productId?: null | number;    qty?: null | number;  }  export interface ProductStock {    id?: null | number;    location?: null | string;    product?: null | Product;    qty?: null | number;  }  export interface Shift {    bank?: null | any;    bill?: null | number;    card?: null | number;    close?: null | string;    closeCurrency?: null | CurrencyShift;    customer?: null | string;    customerAvgCost?: null | string;    deposit?: null | string;    expectedCurrency?: null | CurrencyShift;    id?: null | number;    note?: null | string;    open?: null | string;    openCurrency?: null | CurrencyShift;    user?: null | User;  }  export interface CurrencyShift {    khr?: null | number;    usd?: null | number;  }  export interface ShiftInput {    close?: null | string;    closeCurrency?: null | CurrencyShiftInput;    deposit?: null | string;    note?: null | string;    open?: null | string;    openCurrency?: null | CurrencyShiftInput;    userId: number;  }  export interface CurrencyShiftInput {    khr?: null | number;    usd?: null | number;  }  export interface Setting {    option?: null | string;    type?: null | string;    value?: null | string;  }  export interface ReportSaleFilter {    category?: number[] | null;  }  export interface ProductSell {    product?: null | Product;    qty?: null | number;    sku?: null | SKU;    total?: null | number;  }  export type ReportSaleGroupBy = "PRODUCT" | "DATE";  export interface ProductInput {    addons?: AddonInput[] | null;    category?: null | number;    code?: null | string;    description?: null | string;    images?: null | string;    integrate?: IntegrateInput[] | null;    sku?: SKUInput[] | null;    stockAlter?: null | number;    title?: null | string;    type?: TYPE_PRODUCT[] | null;  }  export interface AddonInput {    id?: null | number;    isRequired?: null | boolean;    name?: null | string;    value?: null | string;  }  export interface SKUInput {    discount?: null | number;    id?: null | number;    image?: null | string;    name?: null | string;    price?: null | number;    status?: null | STATUS_PRODUCT;    unit?: null | string;  }  export interface IntegrateInput {    id?: null | number;    integrateId?: null | number;    productId?: null | number;    qty?: null | string;  }  export interface Product {    addons?: AddonProduct[] | null;    category?: null | Category;    code?: null | string;    description?: null | string;    id?: null | number;    images?: null | string;    integrates?: Integrate[] | null;    sku?: SKU[] | null;    status?: null | STATUS_PRODUCT;    stockAlter?: null | number;    title?: null | string;    type?: TYPE_PRODUCT[] | null;  }  export interface AddonProduct {    id?: null | number;    isRequired?: null | boolean;    name?: null | string;    value?: null | string;  }  export interface SKU {    discount?: null | number;    id?: null | number;    image?: null | string;    name?: null | string;    price?: null | number;    product?: null | Product;    status?: null | STATUS_PRODUCT;    unit?: null | string;  }  export interface Integrate {    id?: null | number;    integrate?: null | Product;    product?: null | Product;    qty?: null | string;  }  export interface FilterProduct {    category?: number[] | null;    isLowStock?: null | boolean;    status?: STATUS_PRODUCT[] | null;    type?: TYPE_PRODUCT[] | null;  }  export type TYPE_PRODUCT = "PRODUCTION" | "RAW" | "ADDON" | "FREEZING" | "SECOND_HAND" | "FREE";  export type STATUS_PRODUCT = "AVAILABLE" | "OUT_OF_STOCK" | "TIME_OUT" | "INACTIVE";  export interface OverTimeInput {    endAt?: null | string;    note?: null | string;    otDate?: null | string;    startat?: null | string;    status?: null | OverTimeStatus;  }  export interface OverTime {    approvedBy?: null | User;    approvedDate?: null | string;    cancelledBy?: null | User;    cancelledDate?: null | string;    endAt?: null | string;    id?: null | number;    note?: null | string;    otDate?: null | string;    rejectedBy?: null | User;    rejectedDate?: null | string;    requestedBy?: null | User;    requestedDate?: null | string;    startat?: null | string;    status?: null | OverTimeStatus;  }  export type OverTimeStatus = "REQUEST" | "APPROVED" | "REJECTED" | "CANCELLED";  export interface OrderScheduleInput {    endAt?: null | string;    items?: OrderScheduleItemInput[] | null;    name?: null | string;    startAt?: null | string;  }  export interface OrderScheduleItemInput {    skuId?: null | number;  }  export interface OrderSchedule {    endAt?: null | string;    id?: null | number;    items?: OrderScheduleItem[] | null;    name?: null | string;    startAt?: null | string;  }  export interface OrderScheduleItem {    sku?: null | SKU;  }  export interface Order {    address?: null | string;    bankId?: null | number;    bankType?: null | string;    code?: null | string;    currency?: null | string;    customerPaid?: null | string;    delivery?: null | Delivery;    deliveryCode?: null | string;    discount?: null | number;    id?: null | number;    invoice?: null | number;    items?: OrderItem[] | null;    log?: OrderLog[] | null;    name?: null | string;    note?: null | string;    paid?: null | string;    person?: null | number;    set?: null | string;    status?: null | StatusOrder;    total?: null | string;    uuid?: null | string;    vat?: null | string;  }  export interface OrderLog {    by?: null | User;    date?: null | string;    text?: null | string;  }  export interface OrderItem {    addons?: null | string;    createdDate?: null | string;    discount?: null | number;    id?: null | number;    isPrint?: null | boolean;    price?: null | number;    product?: null | Product;    qty?: null | number;    remark?: null | string;    sku?: null | SKU;    status?: null | StatusOrderItem;  }  export interface OrderInput {    address?: null | string;    amount?: null | string;    bankId?: null | number;    bankType?: null | string;    carts?: CartItemInput[] | null;    currency?: null | string;    customerPaid?: null | string;    discount?: null | number;    invoice?: null | number;    name?: null | string;    set?: null | string;    uuid?: null | string;  }  export interface CartItemInput {    addons?: null | string;    discount?: null | number;    price?: null | number;    productId?: null | number;    qty?: null | number;    remark?: null | string;    skuId?: null | number;  }  export interface ChangeOrderInput {    amount?: null | string;    bankId?: null | number;    bankType?: null | string;    currency?: null | string;    customerPaid?: null | string;    deliverPickupCode?: null | string;    deliverPickupId?: null | number;    discount?: null | number;    id?: null | number;    invoice?: null | number;    itemStatus?: null | StatusOrderItem;    orderId: number;    reason?: null | string;    status?: null | StatusOrder;  }  export type StatusOrder = "PENDING" | "VERIFY" | "DELIVERY" | "CHECKOUT" | "CANCELLED";  export type StatusOrderItem = "PENDING" | "MAKING" | "OUT_OF_STOCK" | "REQUEST_CHANGE" | "COMPLETED" | "DELETED";  export type OrderViewBy = "KITCHEN" | "ADMIN" | "USER";  export interface LeaveInput {    duration?: null | string;    endDate?: null | string;    leaveReason?: null | string;    leaveType?: null | string;    startDate?: null | string;    status?: null | LeaveStatus;  }  export interface Leave {    approvedBy?: null | User;    approvedDate?: null | string;    cancelledBy?: null | User;    cancelledDate?: null | string;    duration?: null | string;    endDate?: null | string;    id?: null | number;    leaveReason?: null | string;    leaveType?: null | string;    rejectedBy?: null | User;    rejectedDate?: null | string;    requestedBy?: null | User;    requestedDate?: null | string;    startDate?: null | string;    status?: null | LeaveStatus;  }  export type LeaveStatus = "REQUEST" | "APPROVED" | "REJECTED" | "CANCELLED";  export interface HolidayInput {    date?: null | string;    extra?: null | number;    name?: null | string;  }  export interface Holiday {    date?: null | string;    extra?: null | number;    id?: null | number;    name?: null | string;  }  export interface Delivery {    contact?: null | string;    id?: null | number;    name?: null | string;  }  export interface DeliveryInput {    contact?: null | string;    name?: null | string;  }  export interface CategoryInput {    name?: null | string;    root?: null | number;  }  export interface CategoryIndexInput {    id: number;    index: number;  }  export interface Category {    id?: null | number;    index?: null | number;    name?: null | string;    root?: null | number;  }  export interface BrandInput {    logo?: null | string;    name?: null | string;  }  export interface Brand {    id?: null | number;    logo?: null | string;    name?: null | string;  }  export interface BankInfo {    createdDate?: null | string;    id?: null | number;    name?: null | string;    phone?: null | string;    updatedDate?: null | string;  }  export interface Attendance {    checkDate?: null | string;    checkIn?: null | string;    checkOut?: null | string;    id?: null | number;    leave?: null | Leave;    overTimeIn?: null | string;    overTimeOut?: null | string;    type?: null | string;    user?: null | User;  }}