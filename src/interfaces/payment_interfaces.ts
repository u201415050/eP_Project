export interface CustomItemType {
  discountEntered: number
  discountType: string
  name: string
  quantity: number
  unitPrice: number
  tax: any[];
  basePrice: number
  discount: number
  calculatedPrice: number
  calculatedDiscount: number;
  totalTax: number
}
export interface PaymentService {
  authenticateWalletPayment(request: PaymentType, otp: number): Promise<AuthenticateResponse>
  paymentFinalize(paymentId: number): Promise<any>
}

export interface OrderType {
  deliveryCharges: number;
  generalDiscount: number;
  totalDiscount: number;
  products: any[];
  customItems: CustomItemType[];
  generalDiscountType: string;
  roundOffAmount: number;
  salesreturnstatus: number;
  serviceCharges: number;
  totalTax: number;
  subTotal: number;
  calculatedDiscount: number;
  totalPrice: number;
  customer: {
    [key: string]: any
  } | null;
  update(): void;
  addCustomItems(products: any[]): void
}

export interface PaymentType extends PaymentService {
  order: OrderType;
  paymentCurrencyId: number;
  paymentAmount: number;
  paymentTipAmount: number;
  paymentSubTotal: number;
  paymentTotalDiscount: number;
  paymentCustomerId: string;
  created_at: number;
  location: string;
  customFieldArray: any[];
  paymentResponse: PaymentResponseType
  cancel(paymentId: string, clean: boolean): Promise<any>
}


export interface InitiateResponseType {
  merchantId: number;
  userId: number;
  paymentCurrencyId: number;
  paymentAmount: number;
  paymentTipAmount: number;
  paymentSubTotal: number;
  paymentTotalDiscount: number;
  paymentCustomerId: string;
  paymentStatusId: number;
  status: number;
  applicationId: number;
  created_at: number;
  updated_at: number;
  createdUserId: number;
  updatedUserId: number;
  checksum: string;
  paymentId: number;
}

export interface PaymentDetailsType {
  sourceId: string;
  Location: string;
  serviceCharges: number;
  deliveryCharges: number;
  orderId: string;
}

export interface Initiate {
  success: number;
  response: InitiateResponseType;
  paymentDetails: PaymentDetailsType;
}

export interface ProcessResponseType {
  applicationId: number;
  checksum: string;
  created_at: number;
  createdUserId: number;
  merchantId: number;
  paymentId: number;
  transactionTypeId: number;
  transactionStatusId: number;
  transactionCurrencyId: number;
  transactionAmount: number;
  status: number;

  transactionId: number;
  updated_at: number;
  userId: number;
  setInitiate(initiate: Initiate): void
}

export interface Process {
  success: number;
  response: ProcessResponseType;
}
export interface VoidResponse {
  response: {
    applicationId: number;
    checksum: string;
    createdUserId: number;
    created_at: number;
    merchantId: number;
    paymentAmount: string;
    paymentCurrencyId: number;
    paymentCustomerId?: any;
    paymentId: number;
    paymentStatusId: number;
    paymentSubTotal: string;
    paymentTipAmount: string;
    paymentTotalDiscount: string;
    status: number;
    updatedUserId: number;
    updated_at: number;
    userId: number;
  };
  success: number;
}
export interface FinalizeResponseType {
  paymentId: number;
  merchantId: number;
  userId: number;
  paymentStatusId: number;
  paymentCurrencyId: number;
  paymentAmount: string;
  paymentTipAmount: string;
  paymentSubTotal: string;
  paymentTotalDiscount: string;
  paymentCustomerId?: any;
  checksum: string;
  created_at: number;
  updated_at: number;
  createdUserId: number;
  updatedUserId: number;
  status: number;
  applicationId: number;
}

export interface Finalize {
  success: number;
  response: FinalizeResponseType;
  order: any[];
}
export interface PaymentDetailsEpType {
  icon: string
  title: string
  items: PaymentDetailsItemType[]
}
export interface PaymentDetailsItemType {
  name: any,
  value: any
}

export interface PaymentResponseType {
  success: number;
  initiate: Initiate;
  process: Process;
  finalize: Finalize;
  setInitiate(initiate: Initiate): void
  setProcess(process: Process): void
  setFinalize(finalize: Finalize): void
  getCashDetails(): any
  getPaymentId(): string
  getPaymentDetails(title: string, icon: string): PaymentDetailsEpType
}

export interface AuthenticateResponse {
  success: number
  response: {
    applicationId: number;
    checksum: string;
    createdUserId: number;
    created_at: number;
    merchantId: number;
    paymentId: number;
    status: number;
    transactionAmount: string;
    transactionCurrencyId: number;
    transactionId: number;
    transactionStatusId: number;
    transactionTypeId: number;
    updatedUserId: number;
    updated_at: number;
    userId: number;
  }
}

