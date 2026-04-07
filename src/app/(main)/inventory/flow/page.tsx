import { getInventoryFlows } from '@/lib/inventory-server';
import { FlowClient } from '@/components/inventory/flow-client';

export default async function InventoryFlowPage() {
    const flows = await getInventoryFlows();
    return <FlowClient flows={flows} />;
}
