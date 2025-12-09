// src/app/page.tsx
import { apiClient } from '@/lib/api-client';
import { DashboardView } from './_components/dashboard-view';

export default async function DashboardPage() {
  const [customers, accounts, transactions, depositoTypes] = await Promise.all([
    apiClient.getCustomers(),
    apiClient.getAccounts(),
    apiClient.getTransactions(),
    apiClient.getDepositoTypes(),
  ]);

  // Calculate statistics
  const totalCustomers = customers.length;
  const totalAccounts = accounts.length;
  const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);
  const totalTransactions = transactions.length;

  const recentTransactions = transactions.slice(0, 5);

  return (
    <DashboardView
      stats={{
        totalCustomers,
        totalAccounts,
        totalBalance,
        totalTransactions,
      }}
      recentTransactions={recentTransactions}
      depositoTypes={depositoTypes}
    />
  );
}