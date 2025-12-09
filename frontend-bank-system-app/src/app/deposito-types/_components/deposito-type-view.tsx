'use client';

import { useState } from 'react';
import { DepositoType } from '@/lib/types';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/Button';
import { DepositoTypeList } from './deposito-type-list';
import { DepositoTypeForm } from './deposito-type-form';
import { DepositoTypeDelete } from './deposito-type-delete';

interface DepositoTypesViewProps {
  initialDepositoTypes: DepositoType[];
}

export function DepositoTypesView({ initialDepositoTypes }: DepositoTypesViewProps) {
  const [depositoTypes, setDepositoTypes] = useState<DepositoType[]>(initialDepositoTypes);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<DepositoType | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshDepositoTypes = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getDepositoTypes();
      setDepositoTypes(data);
    } catch (error) {
      console.error('Failed to refresh deposito types:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedType(null);
    setIsFormOpen(true);
  };

  const handleEdit = (type: DepositoType) => {
    setSelectedType(type);
    setIsFormOpen(true);
  };

  const handleDelete = (type: DepositoType) => {
    setSelectedType(type);
    setIsDeleteOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedType(null);
    refreshDepositoTypes();
  };

  const handleDeleteSuccess = () => {
    setIsDeleteOpen(false);
    setSelectedType(null);
    refreshDepositoTypes();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Deposito Types</h1>
          <p className="text-gray-600 mt-1">Manage deposito types and interest rates</p>
        </div>
        <Button onClick={handleCreate}>
          + Add Deposito Type
        </Button>
      </div>

      {/* Deposito Type List */}
      <DepositoTypeList
        depositoTypes={depositoTypes}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      {/* Form Modal */}
      {isFormOpen && (
        <DepositoTypeForm
          depositoType={selectedType}
          onSuccess={handleFormSuccess}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedType(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteOpen && selectedType && (
        <DepositoTypeDelete
          depositoType={selectedType}
          onSuccess={handleDeleteSuccess}
          onClose={() => {
            setIsDeleteOpen(false);
            setSelectedType(null);
          }}
        />
      )}
    </div>
  );
}