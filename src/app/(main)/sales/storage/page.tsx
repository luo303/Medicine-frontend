import { getSalesOrders } from '@/lib/sales-server';
import { StorageClient } from '@/components/sales/storage-client';

export default async function SalesStoragePage() {
    const orders = await getSalesOrders();
    return <StorageClient orders={orders} />;
}
