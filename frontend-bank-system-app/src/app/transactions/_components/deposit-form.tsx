/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, FormEvent } from 'react';
import { Account } from '@/lib/types';
import { apiClient } from '@/lib/api-client';
import { formatCurrency, formatDateTimeLocal, dateTimeLocalToISO } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/Loading';

interface DepositFormProps {
  accounts: Account[];
  onSuccess: () => void;
  onClose: () => void;
}

export function DepositForm({ accounts, onSuccess, onClose }: DepositFormProps) {
  const [accountId, setAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionDate, setTransactionDate] = useState(formatDateTimeLocal());
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ accountId?: string; amount?: string; transactionDate?: string }>({});

  const selectedAccount = accounts.find(acc => acc.id === accountId);

  const validate = () => {
    const newErrors: any = {};

    if (!accountId) {
      newErrors.accountId = 'Please select an account';
    }

    const amountNum = parseFloat(amount);
    if (!amount || isNaN(amountNum)) {
      newErrors.amount = 'Amount is required';
    } else if (amountNum <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!transactionDate) {
      newErrors.transactionDate = 'Transaction date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      await apiClient.deposit({
        accountId,
        amount: parseFloat(amount),
        transactionDate: dateTimeLocalToISO(transactionDate),
      });
      onSuccess();
    } catch (err: any) {
      setErrors({ amount: err.message || 'Failed to process deposit' });
    } finally {
      setLoading(false);
    }
  };

  const newBalance = selectedAccount && amount
    ? Number(selectedAccount.balance) + parseFloat(amount || '0')
    : null;

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Deposit Money"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Account <span className="text-red-500">*</span>
          </label>
          <select
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={loading}
          >
            <option value="">Choose an account</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.packet} - {account.customer?.name} ({formatCurrency(account.balance)})
              </option>
            ))}
          </select>
          {errors.accountId && (
            <p className="mt-1 text-sm text-red-600">{errors.accountId}</p>
          )}
        </div>

        {selectedAccount && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Account Details</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-blue-700">Customer</p>
                <p className="font-medium text-blue-900">{selectedAccount.customer?.name}</p>
              </div>
              <div>
                <p className="text-blue-700">Deposito Type</p>
                <p className="font-medium text-blue-900">
                  {selectedAccount.depositoType?.name} ({selectedAccount.depositoType?.yearlyReturn}%)
                </p>
              </div>
              <div>
                <p className="text-blue-700">Current Balance</p>
                <p className="font-bold text-green-600">{formatCurrency(selectedAccount.balance)}</p>
              </div>
            </div>
          </div>
        )}

        <Input
          label="Deposit Amount"
          type="number"
          step="0.01"
          min="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount to deposit"
          required
          disabled={loading}
          error={errors.amount}
        />

        <Input
          label="Transaction Date"
          type="datetime-local"
          value={transactionDate}
          onChange={(e) => setTransactionDate(e.target.value)}
          required
          disabled={loading}
          error={errors.transactionDate}
        />

        {newBalance !== null && amount && !isNaN(parseFloat(amount)) && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-2">New Balance Preview</h4>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700">Current Balance</p>
                <p className="text-xl font-bold text-green-900">
                  {formatCurrency(selectedAccount!.balance)}
                </p>
              </div>
              <div className="text-2xl text-green-600">→</div>
              <div>
                <p className="text-sm text-green-700">New Balance</p>
                <p className="text-xl font-bold text-green-900">
                  {formatCurrency(newBalance)}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 justify-end pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" variant="success" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                Processing...
              </span>
            ) : (
              'Confirm Deposit'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}