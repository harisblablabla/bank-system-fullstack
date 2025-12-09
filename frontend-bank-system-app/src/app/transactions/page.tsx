import { apiClient } from '@/lib/api-client';
import { TransactionsView } from './_components/transaction-view';

export default async function TransactionsPage() {
    const [transactions, accounts] = await Promise.all([
      apiClient.getTransactions(),
      apiClient.getAccounts(),
    ]);

    return (
      <TransactionsView
        initialTransactions={transactions}
        accounts={accounts}
      />
    );
}