import { apiClient } from '@/lib/api-client';
import { CustomersView } from './_components/customer-view';

export default async function CustomersPage() {
    const customers = await apiClient.getCustomers();

    return <CustomersView initialCustomers={customers} />;
    
}