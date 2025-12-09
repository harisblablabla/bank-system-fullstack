'use client';

import { Customer } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/ErrorMessage';

interface CustomerListProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
  loading: boolean;
}

export function CustomerList({ customers, onEdit, onDelete, loading }: CustomerListProps) {
  if (loading) {
    return <Loading />;
  }

  if (customers.length === 0) {
    return (
      <EmptyState
        message="No customers found. Create your first customer to get started."
        actionLabel="Add Customer"
        onAction={() => {}}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableHead>Name</TableHead>
          <TableHead>Accounts</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Actions</TableHead>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>
                <div className="font-medium text-gray-900">{customer.name}</div>
                <div className="text-xs text-gray-500">{customer.id}</div>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {customer.accounts?.length || 0} accounts
                </span>
              </TableCell>
              <TableCell>
                <div className="text-sm text-gray-600">{formatDate(customer.createdAt)}</div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onEdit(customer)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => onDelete(customer)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}