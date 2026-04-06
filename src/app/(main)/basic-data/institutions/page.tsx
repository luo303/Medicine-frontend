import { getMedicalInstitutions } from '@/lib/basic-data-server';
import InstitutionsClient from '@/components/basic-data/institutions-client';

export default async function InstitutionsPage() {
    const institutions = await getMedicalInstitutions();
    
    return <InstitutionsClient institutions={institutions} />;
}
