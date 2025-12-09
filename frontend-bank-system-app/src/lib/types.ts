// ============================================================
// MODELS - TypeScript Interfaces for Data Structures
// ============================================================

export interface Customer {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  accounts?: Account[];
}

export interface DepositoType {
  id: string;
  name: string;
  yearlyReturn: number;
  createdAt: string;
  updatedAt: string;
  accounts?: Account[];
}

export interface Account {
  id: string;
  packet: string;
  customerId: string;
  depositoTypeId: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
  customer?: Customer;
  depositoType?: DepositoType;
  transactions?: Transaction[];
}

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
}

export interface Transaction {
  id: string;
  accountId: string;
  type: TransactionType;
  amount: number;
  transactionDate: string;
  balanceBefore: number;
  balanceAfter: number;
  monthsHeld: number;
  interestEarned: number;
  createdAt: string;
  account?: Account;
}

export interface WithdrawalResponse extends Transaction {
  endingBalance: number;
  summary: string;
}

// ============================================================
// API Response Wrappers
// ============================================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    details?: any[];
  };
}

// ============================================================
// Form DTOs
// ============================================================

export interface CreateCustomerDto {
  name: string;
}

export interface UpdateCustomerDto {
  name?: string;
}

export interface CreateDepositoTypeDto {
  name: string;
  yearlyReturn: number;
}

export interface UpdateDepositoTypeDto {
  name?: string;
  yearlyReturn?: number;
}

export interface CreateAccountDto {
  packet: string;
  customerId: string;
  depositoTypeId: string;
}

export interface UpdateAccountDto {
  packet?: string;
  depositoTypeId?: string;
}

export interface DepositDto {
  accountId: string;
  amount: number;
  transactionDate: string;
}

export interface WithdrawDto {
  accountId: string;
  amount: number;
  transactionDate: string;
}