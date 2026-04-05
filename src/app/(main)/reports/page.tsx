import { getAllReportsData } from '@/lib/reports-server';
import ReportsClient from '@/components/reports-client';

export default async function ReportsPage() {
    const initialData = await getAllReportsData();

    return <ReportsClient initialData={initialData} />;
}
