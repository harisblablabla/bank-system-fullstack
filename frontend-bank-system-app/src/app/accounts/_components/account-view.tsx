'use client';

import { useState } from 'react';
import { Account, Customer, DepositoType } from '@/lib/types';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/Button';
import { AccountList } from './account-list';
import { AccountForm } from './account-form';
import { AccountDelete } from './account-delete';

interface AccountsViewProps {
  initialAccounts: Account[];
  customers: Customer[];
  depositoTypes: DepositoType[];
}

export function AccountsView({ initialAccounts, customers, depositoTypes }: AccountsViewProps) {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(false);
  const [filterCustomerId, setFilterCustomerId] = useState<string>('');

  const refreshAccounts = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getAccounts(filterCustomerId || undefined);
      setAccounts(data);
    } catch (error) {
      console.error('Failed to refresh accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedAccount(null);
    setIsFormOpen(true);
  };

  const handleEdit = (account: Account) => {
    setSelectedAccount(account);
    setIsFormOpen(true);
  };

  const handleDelete = (account: Account) => {
    setSelectedAccount(account);
    setIsDeleteOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedAccount(null);
    refreshAccounts();
  };

  const handleDeleteSuccess = () => {
    setIsDeleteOpen(false);
    setSelectedAccount(null);
    refreshAccounts();
  };

  const handleFilterChange = (customerId: string) => {
    setFilterCustomerId(customerId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Accounts</h1>
          <p className="text-gray-600 mt-1">Manage customer accounts and balances</p>
        </div>
        <Button onClick={handleCreate}>
          + Open Account
        </Button>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Filter by Customer:</label>
          <select
            value={filterCustomerId}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Customers</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
          {filterCustomerId && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setFilterCustomerId('');
                refreshAccounts();
              }}
            >
              Clear Filter
            </Button>
          )}
          <Button
            size="sm"
            variant="secondary"
            onClick={refreshAccounts}
          >
            🔄 Refresh
          </Button>
        </div>
      </div>

      {/* Account List */}
      <AccountList
        accounts={accounts}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      {/* Form Modal */}
      {isFormOpen && (
        <AccountForm
          account={selectedAccount}
          customers={customers}
          depositoTypes={depositoTypes}
          onSuccess={handleFormSuccess}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedAccount(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteOpen && selectedAccount && (
        <AccountDelete
          account={selectedAccount}
          onSuccess={handleDeleteSuccess}
          onClose={() => {
            setIsDeleteOpen(false);
            setSelectedAccount(null);
          }}
        />
      )}
    </div>
  );
}