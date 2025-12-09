'use client';

import { useState } from 'react';
import { Account } from '@/lib/types';
import { apiClient } from '@/lib/api-client';
import { formatCurrency } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/Loading';

interface AccountDeleteProps {
  account: Account;
  onSuccess: () => void;
  onClose: () => void;
}

export function AccountDelete({ account, onSuccess, onClose }: AccountDeleteProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      await apiClient.deleteAccount(account.id);
      onSuccess();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Failed to close account');
    } finally {
      setLoading(false);
    }
  };

  const hasBalance = Number(account.balance) > 0;
  const hasTransactions = account.transactions && account.transactions.length > 0;

  return (
    <Modal isOpen={true} onClose={onClose} title="Close Account" size="md">
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex gap-3">
            <svg
              className="w-6 h-6 text-red-600 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <h4 className="text-red-900 font-medium">Warning: Close Account</h4>
              <p className="text-red-700 text-sm mt-1">
                Are you sure you want to close this account?
              </p>
            </div>
          </div>
        </div>

        {/* Account Details */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Account Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Package:</span>
              <span className="font-medium text-gray-900">{account.packet}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Customer:</span>
              <span className="font-medium text-gray-900">{account.customer?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Deposito Type:</span>
              <span className="font-medium text-gray-900">{account.depositoType?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Current Balance:</span>
              <span className="font-bold text-green-600">{formatCurrency(account.balance)}</span>
            </div>
          </div>
        </div>

        {/* Warnings */}
        {hasBalance && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-yellow-800 text-sm">
              ⚠️ This account has a remaining balance of <strong>{formatCurrency(account.balance)}</strong>. 
              Please withdraw all funds before closing the account.
            </p>
          </div>
        )}

        {hasTransactions && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-blue-800 text-sm">
              ℹ️ All transaction history will be permanently deleted. This action cannot be undone.
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-700 text-sm">{error}</p>
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
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                Closing...
              </span>
            ) : (
              'Close Account'
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}