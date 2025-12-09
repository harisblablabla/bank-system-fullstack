import {
  Customer,
  DepositoType,
  Account,
  Transaction,
  WithdrawalResponse,
  CreateCustomerDto,
  UpdateCustomerDto,
  CreateDepositoTypeDto,
  UpdateDepositoTypeDto,
  CreateAccountDto,
  UpdateAccountDto,
  DepositDto,
  WithdrawDto,
  ApiResponse,
  ApiError,
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

class ApiClient {
  private async fetchApi<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.error.message || 'API request failed');
      }

      const data: ApiResponse<T> = await response.json();
      return data.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // ============================================================
  // CUSTOMERS API
  // ============================================================

  async getCustomers(): Promise<Customer[]> {
    return this.fetchApi<Customer[]>('/customers');
  }

  async getCustomer(id: string): Promise<Customer> {
    return this.fetchApi<Customer>(`/customers/${id}`);
  }

  async createCustomer(data: CreateCustomerDto): Promise<Customer> {
    return this.fetchApi<Customer>('/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCustomer(id: string, data: UpdateCustomerDto): Promise<Customer> {
    return this.fetchApi<Customer>(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCustomer(id: string): Promise<void> {
    await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: 'DELETE',
    });
  }

  // ============================================================
  // DEPOSITO TYPES API
  // ============================================================

  async getDepositoTypes(): Promise<DepositoType[]> {
    return this.fetchApi<DepositoType[]>('/deposito-types');
  }

  async getDepositoType(id: string): Promise<DepositoType> {
    return this.fetchApi<DepositoType>(`/deposito-types/${id}`);
  }

  async createDepositoType(data: CreateDepositoTypeDto): Promise<DepositoType> {
    return this.fetchApi<DepositoType>('/deposito-types', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateDepositoType(
    id: string,
    data: UpdateDepositoTypeDto,
  ): Promise<DepositoType> {
    return this.fetchApi<DepositoType>(`/deposito-types/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteDepositoType(id: string): Promise<void> {
    await fetch(`${API_BASE_URL}/deposito-types/${id}`, {
      method: 'DELETE',
    });
  }

  // ============================================================
  // ACCOUNTS API
  // ============================================================

  async getAccounts(customerId?: string): Promise<Account[]> {
    const query = customerId ? `?customerId=${customerId}` : '';
    return this.fetchApi<Account[]>(`/accounts${query}`);
  }

  async getAccount(id: string): Promise<Account> {
    return this.fetchApi<Account>(`/accounts/${id}`);
  }

  async createAccount(data: CreateAccountDto): Promise<Account> {
    return this.fetchApi<Account>('/accounts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAccount(id: string, data: UpdateAccountDto): Promise<Account> {
    return this.fetchApi<Account>(`/accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAccount(id: string): Promise<void> {
    await fetch(`${API_BASE_URL}/accounts/${id}`, {
      method: 'DELETE',
    });
  }

  // ============================================================
  // TRANSACTIONS API
  // ============================================================

  async getTransactions(accountId?: string): Promise<Transaction[]> {
    const query = accountId ? `?accountId=${accountId}` : '';
    return this.fetchApi<Transaction[]>(`/transactions${query}`);
  }

  async getTransaction(id: string): Promise<Transaction> {
    return this.fetchApi<Transaction>(`/transactions/${id}`);
  }

  async deposit(data: DepositDto): Promise<Transaction> {
    return this.fetchApi<Transaction>('/transactions/deposit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async withdraw(data: WithdrawDto): Promise<WithdrawalResponse> {
    return this.fetchApi<WithdrawalResponse>('/transactions/withdraw', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient();