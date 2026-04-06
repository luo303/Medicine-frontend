import { getWarehouses, getStorageLocations } from '@/lib/basic-data-server';
import WarehousesClient from '@/components/basic-data/warehouses-client';

export default async function WarehousesPage() {
    const [warehouses, storageLocations] = await Promise.all([
        getWarehouses(),
        getStorageLocations(),
    ]);
    
    return <WarehousesClient warehouses={warehouses} storageLocations={storageLocations} />;
}
