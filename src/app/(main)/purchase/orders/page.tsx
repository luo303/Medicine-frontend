import { getPurchaseOrders } from '@/lib/purchase-server';
import PurchaseOrderListClient from '@/components/purchase/order-list-client';

export default async function PurchaseOrdersPage() {
    const orders = await getPurchaseOrders();
    return <PurchaseOrderListClient orders={orders} />;
}
