/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, FormEvent } from 'react';
import { Account, Customer, DepositoType } from '@/lib/types';
import { apiClient } from '@/lib/api-client';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/Loading';

interface AccountFormProps {
  account: Account | null;
  customers: Customer[];
  depositoTypes: DepositoType[];
  onSuccess: () => void;
  onClose: () => void;
}

export function AccountForm({ account, customers, depositoTypes, onSuccess, onClose }: AccountFormProps) {
  const [packet, setPacket] = useState(account?.packet || '');
  const [customerId, setCustomerId] = useState(account?.customerId || '');
  const [depositoTypeId, setDepositoTypeId] = useState(account?.depositoTypeId || '');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ packet?: string; customerId?: string; depositoTypeId?: string }>({});

  const isEdit = !!account;

  const validate = () => {
    const newErrors: any = {};

    if (!packet.trim()) {
      newErrors.packet = 'Packet name is required';
    } else if (packet.trim().length < 2) {
      newErrors.packet = 'Packet name must be at least 2 characters';
    }

    if (!isEdit && !customerId) {
      newErrors.customerId = 'Customer is required';
    }

    if (!depositoTypeId) {
      newErrors.depositoTypeId = 'Deposito type is required';
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
      if (isEdit) {
        await apiClient.updateAccount(account.id, {
          packet: packet.trim(),
          depositoTypeId,
        });
      } else {
        await apiClient.createAccount({
          packet: packet.trim(),
          customerId,
          depositoTypeId,
        });
      }
      onSuccess();
    } catch (err: any) {
      setErrors({ packet: err.message || 'Failed to save account' });
    } finally {
      setLoading(false);
    }
  };

  const selectedDepositoType = depositoTypes.find(dt => dt.id === depositoTypeId);

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={isEdit ? 'Edit Account' : 'Open New Account'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Account Package Name"
          type="text"
          value={packet}
          onChange={(e) => setPacket(e.target.value)}
          placeholder="e.g., Premium Savings Account"
          required
          disabled={loading}
          error={errors.packet}
        />

        {!isEdit && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer <span className="text-red-500">*</span>
            </label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={loading}
            >
              <option value="">Select a customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
            {errors.customerId && (
              <p className="mt-1 text-sm text-red-600">{errors.customerId}</p>
            )}
          </div>
        )}

        {isEdit && account && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-sm text-gray-700">
              <strong>Customer:</strong> {account.customer?.name}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Customer cannot be changed after account creation
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Deposito Type <span className="text-red-500">*</span>
          </label>
          <select
            value={depositoTypeId}
            onChange={(e) => setDepositoTypeId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={loading}
          >
            <option value="">Select a deposito type</option>
            {depositoTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name} - {type.yearlyReturn}% yearly
              </option>
            ))}
          </select>
          {errors.depositoTypeId && (
            <p className="mt-1 text-sm text-red-600">{errors.depositoTypeId}</p>
          )}
        </div>

        {selectedDepositoType && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Interest Rate Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-blue-700">Yearly Return</p>
                <p className="text-2xl font-bold text-blue-900">
                  {selectedDepositoType.yearlyReturn}%
                </p>
              </div>
              <div>
                <p className="text-blue-700">Monthly Return</p>
                <p className="text-2xl font-bold text-blue-900">
                  {(selectedDepositoType.yearlyReturn / 12).toFixed(2)}%
                </p>
              </div>
            </div>
            <p className="text-xs text-blue-600 mt-2">
              Interest is calculated using compound interest formula when withdrawing funds
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
          <Button type="submit" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                Saving...
              </span>
            ) : (
              isEdit ? 'Update Account' : 'Open Account'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}