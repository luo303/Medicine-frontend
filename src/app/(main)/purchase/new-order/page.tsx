import { getManufacturers, getDrugs } from '@/lib/basic-data-server';
import NewPurchaseOrderClient from '@/components/purchase/new-order-client';

export default async function NewPurchaseOrderPage() {
    const [manufacturers, drugs] = await Promise.all([
        getManufacturers(),
        getDrugs(),
    ]);
    return <NewPurchaseOrderClient manufacturers={manufacturers} drugs={drugs} />;
}
