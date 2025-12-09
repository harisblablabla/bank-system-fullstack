'use client';

import { Account } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/ErrorMessage';

interface AccountListProps {
  accounts: Account[];
  onEdit: (account: Account) => void;
  onDelete: (account: Account) => void;
  loading: boolean;
}

export function AccountList({ accounts, onEdit, onDelete, loading }: AccountListProps) {
  if (loading) {
    return <Loading />;
  }

  if (accounts.length === 0) {
    return (
      <EmptyState
        message="No accounts found. Open your first account to get started."
        actionLabel="Open Account"
        onAction={() => {}}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableHead>Account Info</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Deposito Type</TableHead>
          <TableHead>Balance</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Actions</TableHead>
        </TableHeader>
        <TableBody>
          {accounts.map((account) => (
            <TableRow key={account.id}>
              <TableCell>
                <div className="font-medium text-gray-900">{account.packet}</div>
                <div className="text-xs text-gray-500">{account.id}</div>
              </TableCell>
              <TableCell>
                <div className="font-medium text-gray-900">
                  {account.customer?.name || 'Unknown'}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">
                    {account.depositoType?.name || 'Unknown'}
                  </span>
                  <span className="text-xs text-blue-600">
                    {account.depositoType?.yearlyReturn}% yearly
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="font-bold text-green-600">
                  {formatCurrency(account.balance)}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm text-gray-600">{formatDate(account.createdAt)}</div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onEdit(account)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => onDelete(account)}
                  >
                    Close
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