'use client';

import { useState } from 'react';
import { Transaction, Account } from '@/lib/types';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/Button';
import { TransactionList } from './transaction-list';
import { DepositForm } from './deposit-form';
import { WithdrawForm } from './withdraw-form';

interface TransactionsViewProps {
  initialTransactions: Transaction[];
  accounts: Account[];
}

export function TransactionsView({ initialTransactions, accounts }: TransactionsViewProps) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterAccountId, setFilterAccountId] = useState<string>('');

  const refreshTransactions = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getTransactions(filterAccountId || undefined);
      setTransactions(data);
    } catch (error) {
      console.error('Failed to refresh transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDepositSuccess = () => {
    setIsDepositOpen(false);
    refreshTransactions();
  };

  const handleWithdrawSuccess = () => {
    setIsWithdrawOpen(false);
    refreshTransactions();
  };

  const handleFilterChange = (accountId: string) => {
    setFilterAccountId(accountId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600 mt-1">Manage deposits and withdrawals</p>
        </div>
        <div className="flex gap-3">
          <Button variant="success" onClick={() => setIsDepositOpen(true)}>
            + Deposit
          </Button>
          <Button variant="secondary" onClick={() => setIsWithdrawOpen(true)}>
            ↑ Withdraw
          </Button>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Filter by Account:</label>
          <select
            value={filterAccountId}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Accounts</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.packet} - {account.customer?.name}
              </option>
            ))}
          </select>
          {filterAccountId && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setFilterAccountId('');
                refreshTransactions();
              }}
            >
              Clear Filter
            </Button>
          )}
          <Button
            size="sm"
            variant="secondary"
            onClick={refreshTransactions}
          >
            🔄 Refresh
          </Button>
        </div>
      </div>

      {/* Transaction List */}
      <TransactionList
        transactions={transactions}
        loading={loading}
      />

      {/* Deposit Form Modal */}
      {isDepositOpen && (
        <DepositForm
          accounts={accounts}
          onSuccess={handleDepositSuccess}
          onClose={() => setIsDepositOpen(false)}
        />
      )}

      {/* Withdraw Form Modal */}
      {isWithdrawOpen && (
        <WithdrawForm
          accounts={accounts}
          onSuccess={handleWithdrawSuccess}
          onClose={() => setIsWithdrawOpen(false)}
        />
      )}
    </div>
  );
}