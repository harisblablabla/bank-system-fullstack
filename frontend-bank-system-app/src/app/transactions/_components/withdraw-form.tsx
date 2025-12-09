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

interface WithdrawFormProps {
  accounts: Account[];
  onSuccess: () => void;
  onClose: () => void;
}

export function WithdrawForm({ accounts, onSuccess, onClose }: WithdrawFormProps) {
  const [accountId, setAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionDate, setTransactionDate] = useState(formatDateTimeLocal());
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
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
    } else if (selectedAccount && amountNum > Number(selectedAccount.balance)) {
      newErrors.amount = `Insufficient balance. Available: ${formatCurrency(selectedAccount.balance)}`;
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
      const result = await apiClient.withdraw({
        accountId,
        amount: parseFloat(amount),
        transactionDate: dateTimeLocalToISO(transactionDate),
      });
      setSuccessData(result);
    } catch (err: any) {
      setErrors({ amount: err.message || 'Failed to process withdrawal' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (successData) {
      onSuccess();
    } else {
      onClose();
    }
  };

  if (successData) {
    return (
      <Modal
        isOpen={true}
        onClose={handleClose}
        title="✅ Withdrawal Successful"
        size="lg"
      >
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-green-900">Withdrawal Processed!</h3>
              <p className="text-sm text-green-700 mt-1">{successData.summary}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600">Withdrawal Amount</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(successData.amount)}</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600">Interest Earned</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(successData.interestEarned)}</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600">Months Held</p>
                <p className="text-2xl font-bold text-gray-900">{successData.monthsHeld}</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600">New Balance</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(successData.balanceAfter)}</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">💡 Interest Calculation</h4>
            <p className="text-sm text-blue-700">
              Your money was held for <strong>{successData.monthsHeld} month(s)</strong>, earning{' '}
              <strong>{formatCurrency(successData.interestEarned)}</strong> in compound interest.
            </p>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleClose} variant="primary">
              Done
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Withdraw Money"
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
                  {selectedAccount.depositoType?.name} ({selectedAccount.depositoType?.yearlyReturn}% yearly)
                </p>
              </div>
              <div>
                <p className="text-blue-700">Available Balance</p>
                <p className="font-bold text-green-600">{formatCurrency(selectedAccount.balance)}</p>
              </div>
              <div>
                <p className="text-blue-700">Monthly Interest</p>
                <p className="font-medium text-blue-900">
                  {selectedAccount.depositoType ? (selectedAccount.depositoType.yearlyReturn / 12).toFixed(2) : 0}%
                </p>
              </div>
            </div>
          </div>
        )}

        <Input
          label="Withdrawal Amount"
          type="number"
          step="0.01"
          min="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount to withdraw"
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

        {selectedAccount && amount && parseFloat(amount) <= Number(selectedAccount.balance) && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-900 mb-2">⚠️ Important Notice</h4>
            <p className="text-sm text-yellow-800">
              Interest will be automatically calculated based on the deposit date and withdrawal date.
              The system will apply compound interest using the formula:{' '}
              <code className="bg-yellow-100 px-2 py-1 rounded text-xs">
                ending_balance = starting_balance × (1 + monthly_return)^months
              </code>
            </p>
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
          <Button type="submit" variant="danger" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                Processing...
              </span>
            ) : (
              'Confirm Withdrawal'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}