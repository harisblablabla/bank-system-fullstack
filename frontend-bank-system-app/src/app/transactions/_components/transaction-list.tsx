'use client';

import { Transaction } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/Table';
import { Loading } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/ErrorMessage';

interface TransactionListProps {
  transactions: Transaction[];
  loading: boolean;
}

export function TransactionList({ transactions, loading }: TransactionListProps) {
  if (loading) {
    return <Loading />;
  }

  if (transactions.length === 0) {
    return (
      <EmptyState
        message="No transactions found. Make your first deposit or withdrawal to get started."
      />
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableHead>Type</TableHead>
          <TableHead>Account</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Balance Before</TableHead>
          <TableHead>Balance After</TableHead>
          <TableHead>Interest Details</TableHead>
          <TableHead>Date</TableHead>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'DEPOSIT'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {transaction.type === 'DEPOSIT' ? '↓' : '↑'}
                  </div>
                  <span className="font-medium text-gray-900">{transaction.type}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium text-gray-900">
                  {transaction.account?.packet || 'Unknown'}
                </div>
                <div className="text-xs text-gray-500">
                  {transaction.account?.customer?.name}
                </div>
              </TableCell>
              <TableCell>
                <div
                  className={`font-bold ${
                    transaction.type === 'DEPOSIT' ? 'text-green-600' : 'text-red-600'
                  }`}
                  suppressHydrationWarning
                >
                  {transaction.type === 'DEPOSIT' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </div>
              </TableCell>
              <TableCell>
                <div
                  className="text-sm text-gray-600"
                  suppressHydrationWarning
                >
                  {formatCurrency(transaction.balanceBefore)}
                </div>
              </TableCell>
              <TableCell>
                <div
                  className="text-sm font-medium text-gray-900"
                  suppressHydrationWarning
                >
                  {formatCurrency(transaction.balanceAfter)}
                </div>
              </TableCell>
              <TableCell>
                {transaction.type === 'WITHDRAWAL' && transaction.monthsHeld > 0 ? (
                  <div className="text-sm">
                    <div
                      className="text-blue-600 font-medium"
                      suppressHydrationWarning
                    >
                      +{formatCurrency(transaction.interestEarned)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {transaction.monthsHeld} month{transaction.monthsHeld > 1 ? 's' : ''}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-400">-</div>
                )}
              </TableCell>
              <TableCell>
                <div
                  className="text-sm text-gray-600"
                  suppressHydrationWarning
                >
                  {formatDate(transaction.transactionDate)}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}