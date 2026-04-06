import { getManufacturers } from '@/lib/basic-data-server';
import ManufacturersClient from '@/components/basic-data/manufacturers-client';

export default async function ManufacturersPage() {
    const manufacturers = await getManufacturers();
    
    return <ManufacturersClient manufacturers={manufacturers} />;
}
