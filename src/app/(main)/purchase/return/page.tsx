import { getPurchaseOrders, getPurchaseStorages } from '@/lib/purchase-server';
import PurchaseReturnClient from '@/components/purchase/return-client';

export default async function PurchaseReturnPage() {
    const [orders, storages] = await Promise.all([
        getPurchaseOrders(),
        getPurchaseStorages(),
    ]);
    return <PurchaseReturnClient orders={orders} storages={storages} />;
}
