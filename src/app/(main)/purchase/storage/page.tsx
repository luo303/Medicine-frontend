import { getPurchaseOrders } from '@/lib/purchase-server';
import PurchaseStorageClient from '@/components/purchase/storage-client';

export default async function PurchaseStoragePage() {
    const orders = await getPurchaseOrders();
    const pendingOrders = orders.filter(o => o.status === '已审核' || o.status === '部分入库');
    return <PurchaseStorageClient orders={pendingOrders} />;
}
