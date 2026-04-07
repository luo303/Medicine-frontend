import { getSalesOrders } from '@/lib/sales-server';
import { ReturnClient } from '@/components/sales/return-client';

export default async function SalesReturnPage() {
    const orders = await getSalesOrders();
    return <ReturnClient orders={orders} />;
}
