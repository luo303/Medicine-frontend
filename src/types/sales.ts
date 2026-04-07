export interface Institution {
    approval_no: string;
    name: string;
    address: string;
    postal_code: string;
    phone: string;
    is_specialized: boolean;
}

export interface SalesDetail {
    id: number;
    orderNo: string;
    manufacturerApprovalNo: string;
    drugApprovalNo: string;
    drug_name: string;
    production_date: string;
    quantity: number;
    unit_price: string;
    amount: string;
}

export interface SalesOrder {
    order_no: string;
    sales_date: string;
    institutionApprovalNo: string;
    institution_name: string;
    total_amount: string;
    salesperson: string;
    status: string;
    create_time: string;
    institution: Institution;
    salesDetails: SalesDetail[];
}

export interface SalesOutboundDetail {
    id: number;
    orderNo: string;
    drugApprovalNo: string;
    drug_name: string;
    batch_number: string;
    production_date: string;
    expiry_date: string;
    quantity: number;
    outbound_quantity: number;
    inventory_quantity: number;
}

export interface SalesOutbound {
    id: number;
    order_no: string;
    outbound_date: string;
    institution_name: string;
    salesperson: string;
    status: string;
    details: SalesOutboundDetail[];
}

export const SALES_STATUS_MAP: Record<string, { label: string; color: string }> = {
    '全部出库': { label: '全部出库', color: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20' },
    '部分出库': { label: '部分出库', color: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20' },
    '已审核': { label: '已审核', color: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20' },
    '待审核': { label: '待审核', color: 'text-slate-600 bg-slate-50 dark:text-slate-400 dark:bg-slate-900/20' },
};
