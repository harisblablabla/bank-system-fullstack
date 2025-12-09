import { apiClient } from '@/lib/api-client';
import { DepositoTypesView } from './_components/deposito-type-view'

export default async function DepositoTypesPage() {
    const depositoTypes = await apiClient.getDepositoTypes();

    return <DepositoTypesView initialDepositoTypes={depositoTypes} />;
    
}