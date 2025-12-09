'use client';

import { useState } from 'react';
import { Customer } from '@/lib/types';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/Button';
import { CustomerList } from './customer-list';
import { CustomerForm } from './customer-form';
import { CustomerDelete } from './customer-delete';

interface CustomersViewProps {
  initialCustomers: Customer[];
}

export function CustomersView({ initialCustomers }: CustomersViewProps) {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshCustomers = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Failed to refresh customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedCustomer(null);
    setIsFormOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsFormOpen(true);
  };

  const handleDelete = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDeleteOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedCustomer(null);
    refreshCustomers();
  };

  const handleDeleteSuccess = () => {
    setIsDeleteOpen(false);
    setSelectedCustomer(null);
    refreshCustomers();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600 mt-1">Manage customer accounts</p>
        </div>
        <Button onClick={handleCreate}>
          + Add Customer
        </Button>
      </div>

      {/* Customer List */}
      <CustomerList
        customers={customers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      {/* Customer Form Modal */}
      {isFormOpen && (
        <CustomerForm
          customer={selectedCustomer}
          onSuccess={handleFormSuccess}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedCustomer(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteOpen && selectedCustomer && (
        <CustomerDelete
          customer={selectedCustomer}
          onSuccess={handleDeleteSuccess}
          onClose={() => {
            setIsDeleteOpen(false);
            setSelectedCustomer(null);
          }}
        />
      )}
    </div>
  );
}