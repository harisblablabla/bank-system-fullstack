'use client';

import { useState, FormEvent } from 'react';
import { DepositoType } from '@/lib/types';
import { apiClient } from '@/lib/api-client';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/Loading';

interface DepositoTypeFormProps {
  depositoType: DepositoType | null;
  onSuccess: () => void;
  onClose: () => void;
}

export function DepositoTypeForm({ depositoType, onSuccess, onClose }: DepositoTypeFormProps) {
  const [name, setName] = useState(depositoType?.name || '');
  const [yearlyReturn, setYearlyReturn] = useState(depositoType?.yearlyReturn?.toString() || '');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; yearlyReturn?: string }>({});

  const isEdit = !!depositoType;

  const validate = () => {
    const newErrors: { name?: string; yearlyReturn?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    const yearlyReturnNum = parseFloat(yearlyReturn);
    if (!yearlyReturn || isNaN(yearlyReturnNum)) {
      newErrors.yearlyReturn = 'Yearly return is required';
    } else if (yearlyReturnNum < 0) {
      newErrors.yearlyReturn = 'Yearly return must be at least 0';
    } else if (yearlyReturnNum > 100) {
      newErrors.yearlyReturn = 'Yearly return must not exceed 100';
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
      const data = {
        name: name.trim(),
        yearlyReturn: parseFloat(yearlyReturn),
      };

      if (isEdit) {
        await apiClient.updateDepositoType(depositoType.id, data);
      } else {
        await apiClient.createDepositoType(data);
      }
      onSuccess();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setErrors({ name: err.message || 'Failed to save deposito type' });
    } finally {
      setLoading(false);
    }
  };

  const monthlyReturn = yearlyReturn ? (parseFloat(yearlyReturn) / 12).toFixed(2) : '0.00';

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={isEdit ? 'Edit Deposito Type' : 'Add New Deposito Type'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Deposito Type Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Deposito Platinum"
          required
          disabled={loading}
          error={errors.name}
        />

        <Input
          label="Yearly Return (%)"
          type="number"
          step="0.01"
          min="0"
          max="100"
          value={yearlyReturn}
          onChange={(e) => setYearlyReturn(e.target.value)}
          placeholder="e.g., 8.5"
          required
          disabled={loading}
          error={errors.yearlyReturn}
        />

        {yearlyReturn && !isNaN(parseFloat(yearlyReturn)) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-900">
              <strong>Monthly Return:</strong> {monthlyReturn}%
            </p>
            <p className="text-xs text-blue-700 mt-1">
              This is the monthly interest rate that will be applied to accounts using this deposito type.
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
              isEdit ? 'Update Deposito Type' : 'Create Deposito Type'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}