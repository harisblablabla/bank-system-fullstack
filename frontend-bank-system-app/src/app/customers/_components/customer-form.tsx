'use client';

import { useState, FormEvent } from 'react';
import { Customer } from '@/lib/types';
import { apiClient } from '@/lib/api-client';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/Loading';

interface CustomerFormProps {
  customer: Customer | null;
  onSuccess: () => void;
  onClose: () => void;
}

export function CustomerForm({ customer, onSuccess, onClose }: CustomerFormProps) {
  const [name, setName] = useState(customer?.name || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEdit = !!customer;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        await apiClient.updateCustomer(customer.id, { name: name.trim() });
      } else {
        await apiClient.createCustomer({ name: name.trim() });
      }
      onSuccess();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Failed to save customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={isEdit ? 'Edit Customer' : 'Add New Customer'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Customer Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter customer name"
          required
          disabled={loading}
          error={error}
        />

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
              isEdit ? 'Update Customer' : 'Create Customer'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}