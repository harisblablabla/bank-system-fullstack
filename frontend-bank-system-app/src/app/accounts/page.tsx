import { apiClient } from '@/lib/api-client';
import { AccountsView } from './_components/account-view';

export default async function AccountsPage() {
    const [accounts, customers, depositoTypes] = await Promise.all([
      apiClient.getAccounts(),
      apiClient.getCustomers(),
      apiClient.getDepositoTypes(),
    ]);

    return (
      <AccountsView
        initialAccounts={accounts}
        customers={customers}
        depositoTypes={depositoTypes}
      />
    );
}