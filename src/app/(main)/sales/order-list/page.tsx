import { getSalesOrders } from '@/lib/sales-server';
import { OrderListClient } from '@/components/sales/order-list-client';

export default async function SalesOrderListPage() {
    const orders = await getSalesOrders();
    return <OrderListClient orders={orders} />;
}
