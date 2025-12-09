'use client';

import { ReactNode } from 'react';

interface TableProps {
  children: ReactNode;
}

export function Table({ children }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        {children}
      </table>
    </div>
  );
}

interface TableHeaderProps {
  children: ReactNode;
}

export function TableHeader({ children }: TableHeaderProps) {
  return (
    <thead className="bg-gray-50">
      <tr>{children}</tr>
    </thead>
  );
}

interface TableHeadProps {
  children: ReactNode;
}

export function TableHead({ children }: TableHeadProps) {
  return (
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      {children}
    </th>
  );
}

interface TableBodyProps {
  children: ReactNode;
}

export function TableBody({ children }: TableBodyProps) {
  return (
    <tbody className="bg-white divide-y divide-gray-200">
      {children}
    </tbody>
  );
}

interface TableRowProps {
  children: ReactNode;
}

export function TableRow({ children }: TableRowProps) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      {children}
    </tr>
  );
}

interface TableCellProps {
  children: ReactNode;
}

export function TableCell({ children }: TableCellProps) {
  return (
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
      {children}
    </td>
  );
}