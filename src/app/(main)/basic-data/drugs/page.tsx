import { getDrugs } from '@/lib/basic-data-server';
import DrugsClient from '@/components/basic-data/drugs-client';

export default async function DrugsPage() {
    const drugs = await getDrugs();
    
    return <DrugsClient drugs={drugs} />;
}
