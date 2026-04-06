import { getDashboardStats, DashboardStats } from '@/lib/dashboard-server';
import Dashboard from '@/components/dashboard';

export default async function HomePage() {
    const stats = await getDashboardStats();
    return <Dashboard stats={stats} />;
}
