import { getInventories } from '@/lib/inventory-server';
import { CheckClient } from '@/components/inventory/check-client';

export default async function InventoryCheckPage() {
    const inventories = await getInventories();
    return <CheckClient inventories={inventories} />;
}
