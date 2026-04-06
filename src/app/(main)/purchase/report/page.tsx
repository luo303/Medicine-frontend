import { getPurchaseOrders } from '@/lib/purchase-server';
import PurchaseReportClient from '@/components/purchase/report-client';

export default async function PurchaseReportPage() {
    const orders = await getPurchaseOrders();
    return <PurchaseReportClient orders={orders} />;
}
