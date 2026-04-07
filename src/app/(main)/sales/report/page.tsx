import { getSalesOrders } from '@/lib/sales-server';
import { ReportClient } from '@/components/sales/report-client';

export default async function SalesReportPage() {
    const orders = await getSalesOrders();
    return <ReportClient orders={orders} />;
}
