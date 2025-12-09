'use client';

import { DepositoType } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/ErrorMessage';

interface DepositoTypeListProps {
  depositoTypes: DepositoType[];
  onEdit: (type: DepositoType) => void;
  onDelete: (type: DepositoType) => void;
  loading: boolean;
}

export function DepositoTypeList({ depositoTypes, onEdit, onDelete, loading }: DepositoTypeListProps) {
  if (loading) {
    return <Loading />;
  }

  if (depositoTypes.length === 0) {
    return (
      <EmptyState
        message="No deposito types found. Create your first deposito type to get started."
        actionLabel="Add Deposito Type"
        onAction={() => {}}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableHead>Name</TableHead>
          <TableHead>Yearly Return</TableHead>
          <TableHead>Monthly Return</TableHead>
          <TableHead>Accounts Using</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Actions</TableHead>
        </TableHeader>
        <TableBody>
          {depositoTypes.map((type) => (
            <TableRow key={type.id}>
              <TableCell>
                <div className="font-medium text-gray-900">{type.name}</div>
                <div className="text-xs text-gray-500">{type.id}</div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-blue-600">
                    {type.yearlyReturn}%
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm text-gray-600">
                  {(type.yearlyReturn / 12).toFixed(2)}%
                </div>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {type.accounts?.length || 0} accounts
                </span>
              </TableCell>
              <TableCell>
                <div className="text-sm text-gray-600">{formatDate(type.createdAt)}</div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onEdit(type)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => onDelete(type)}
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