import { getInventories } from '@/lib/inventory-server';
import { WarningClient } from '@/components/inventory/warning-client';

export default async function InventoryWarningPage() {
    const inventories = await getInventories();
    return <WarningClient inventories={inventories} />;
}
