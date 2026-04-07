import { getInventories } from '@/lib/inventory-server';
import { InventoryClient } from '@/components/inventory/inventory-client';

export default async function InventoryPage() {
    const inventories = await getInventories();
    return <InventoryClient inventories={inventories} />;
}
