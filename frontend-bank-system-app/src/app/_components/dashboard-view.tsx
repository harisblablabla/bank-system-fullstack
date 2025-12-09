'use client';

import { Transaction, DepositoType } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';

interface DashboardViewProps {
  stats: {
    totalCustomers: number;
    totalAccounts: number;
    totalBalance: number;
    totalTransactions: number;
  };
  recentTransactions: Transaction[];
  depositoTypes: DepositoType[];
}

export function DashboardView({ stats, recentTransactions, depositoTypes }: DashboardViewProps) {
  const statCards = [
    {
      label: 'Total Customers',
      value: stats.totalCustomers,
      icon: '👥',
      color: 'bg-blue-50 text-blue-700',
      link: '/customers',
    },
    {
      label: 'Total Accounts',
      value: stats.totalAccounts,
      icon: '💳',
      color: 'bg-green-50 text-green-700',
      link: '/accounts',
    },
    {
      label: 'Total Balance',
      value: formatCurrency(stats.totalBalance),
      icon: '💰',
      color: 'bg-yellow-50 text-yellow-700',
      link: '/accounts',
    },
    {
      label: 'Total Transactions',
      value: stats.totalTransactions,
      icon: '📊',
      color: 'bg-purple-50 text-purple-700',
      link: '/transactions',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your bank saving system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            href={stat.link}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
            <p
              className="text-2xl font-bold text-gray-900"
              suppressHydrationWarning
            >
              {stat.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
            <Link
              href="/transactions"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {recentTransactions.length === 0 ? (
              <p className="text-gray-500 text-sm">No transactions yet</p>
            ) : (
              recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'DEPOSIT'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {transaction.type === 'DEPOSIT' ? '↓' : '↑'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.type}</p>
                      <p
                        className="text-sm text-gray-500"
                        suppressHydrationWarning
                      >
                        {formatDate(transaction.transactionDate)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        transaction.type === 'DEPOSIT' ? 'text-green-600' : 'text-red-600'
                      }`}
                      suppressHydrationWarning
                    >
                      {transaction.type === 'DEPOSIT' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Deposito Types */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Deposito Types</h2>
            <Link
              href="/deposito-types"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Manage →
            </Link>
          </div>
          <div className="space-y-3">
            {depositoTypes.map((type) => (
              <div
                key={type.id}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100"
              >
                <div>
                  <p className="font-medium text-gray-900">{type.name}</p>
                  <p className="text-sm text-gray-600">Yearly Return</p>
                </div>
                <div className="text-right">
                  <p
                    className="text-2xl font-bold text-blue-600"
                    suppressHydrationWarning
                  >
                    {type.yearlyReturn}%
                  </p>
                  <p
                    className="text-xs text-gray-500"
                    suppressHydrationWarning
                  >
                    {(type.yearlyReturn / 12).toFixed(2)}% monthly
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/customers"
            className="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <span className="text-2xl">👤</span>
            <span className="text-sm font-medium text-gray-700">Add Customer</span>
          </Link>
          <Link
            href="/accounts"
            className="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <span className="text-2xl">🏦</span>
            <span className="text-sm font-medium text-gray-700">Open Account</span>
          </Link>
          <Link
            href="/transactions"
            className="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <span className="text-2xl">💵</span>
            <span className="text-sm font-medium text-gray-700">Deposit</span>
          </Link>
          <Link
            href="/transactions"
            className="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <span className="text-2xl">💸</span>
            <span className="text-sm font-medium text-gray-700">Withdraw</span>
          </Link>
        </div>
      </div>
    </div>
  );
}