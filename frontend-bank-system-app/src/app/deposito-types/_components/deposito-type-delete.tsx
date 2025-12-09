'use client';

import { useState } from 'react';
import { DepositoType } from '@/lib/types';
import { apiClient } from '@/lib/api-client';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/Loading';

interface DepositoTypeDeleteProps {
  depositoType: DepositoType;
  onSuccess: () => void;
  onClose: () => void;
}

export function DepositoTypeDelete({ depositoType, onSuccess, onClose }: DepositoTypeDeleteProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      await apiClient.deleteDepositoType(depositoType.id);
      onSuccess();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Failed to delete deposito type');
    } finally {
      setLoading(false);
    }
  };

  const hasAccounts = depositoType.accounts && depositoType.accounts.length > 0;

  return (
    <Modal isOpen={true} onClose={onClose} title="Delete Deposito Type">
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
              <h4 className="text-red-900 font-medium">Warning</h4>
              <p className="text-red-700 text-sm mt-1">
                Are you sure you want to delete <strong>{depositoType.name}</strong>?
              </p>
              {hasAccounts ? (
                <p className="text-red-600 text-sm mt-2">
                  <strong>Cannot delete:</strong> This deposito type is currently being used by{' '}
                  {depositoType.accounts!.length} account(s). Please remove or reassign these accounts first.
                </p>
              ) : (
                <p className="text-red-600 text-sm mt-2">
                  This action cannot be undone.
                </p>
              )}
            </div>
          </div>
        </div>

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
            disabled={loading || hasAccounts}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                Deleting...
              </span>
            ) : (
              'Delete Deposito Type'
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}