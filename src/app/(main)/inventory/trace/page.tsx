import { getInventories } from '@/lib/inventory-server';
import { TraceClient } from '@/components/inventory/trace-client';

export default async function BatchTracePage() {
    const inventories = await getInventories();
    return <TraceClient inventories={inventories} />;
}
