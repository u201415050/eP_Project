export interface TransactionList {
  count: string;
  limit: number;
  list: TransationItem[];
  offset: number;
  success: number;
}

export interface TransationItem {
  applicationId: number;
  created_at: number;
  merchantCompanyName: string;
  merchantId: number;
  name: string;
  paymentId: number;
  transactionAmount: string;
  transactionDetails: any[];
  transactionId: number;
  transactionStatus: string;
  transactionStatusId: number;
  transactionType: string;
  transactionTypeId: number;
  userId: number;
}