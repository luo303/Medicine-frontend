import { getSalesOrders } from '@/lib/sales-server';
import { getMedicalInstitutions } from '@/lib/basic-data-server';
import { getDrugs } from '@/lib/basic-data-server';
import { NewOrderClient } from '@/components/sales/new-order-client';

export default async function NewSalesOrderPage() {
    const [orders, institutions, drugs] = await Promise.all([
        getSalesOrders(),
        getMedicalInstitutions(),
        getDrugs(),
    ]);

    const institutionOptions = institutions.map(inst => ({
        approval_no: inst.approval_no,
        name: inst.name,
    }));

    const drugOptions = drugs.map(drug => ({
        approval_no: drug.approval_no,
        name: drug.name,
        price: '0',
    }));

    return (
        <NewOrderClient
            orders={orders}
            institutions={institutionOptions}
            drugs={drugOptions}
        />
    );
}
