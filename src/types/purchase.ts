export interface PurchaseOrder {
  order_no: string;
  order_date: string;
  manufacturerApprovalNo: string;
  manufacturer_name: string;
  total_amount: string;
  purchaser: string;
  status: string;
  create_time: string;
  manufacturer?: {
    approval_no: string;
    name: string;
    city: string;
    address: string;
    postal_code: string;
    phone: string;
    is_gmp: boolean;
  };
  purchaseDetails?: PurchaseDetail[];
  purchaseStorages?: PurchaseStorage[];
}

export interface PurchaseDetail {
  id: number;
  orderNo: string;
  drugApprovalNo: string;
  drug_name: string;
  production_date: string;
  validity_months: number;
  quantity: number;
  unit_price: string;
  amount: string;
}

export interface PurchaseStorage {
  id: number;
  warehouse_code: string;
  location_code: string;
  orderNo: string;
  storage_date: string;
  manufacturerApprovalNo: string;
  drugApprovalNo: string;
  drug_name: string;
  production_date: string;
  expiry_date: string;
  quantity: number;
  purchaser: string;
  inspector: string;
  keeper: string;
  batch_no: string;
  create_time: string;
}

export interface PurchaseReport {
  month: string;
  order_count: number;
  purchase_amount: number;
  storage_amount: number;
  return_amount: number;
}

export const PURCHASE_STATUS_MAP: Record<
  string,
  { label: string; color: string }
> = {
  待审核: {
    label: "待审核",
    color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20",
  },
  已审核: {
    label: "已审核",
    color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
  },
  部分入库: {
    label: "部分入库",
    color: "text-orange-600 bg-orange-50 dark:bg-orange-900/20",
  },
  全部入库: {
    label: "全部入库",
    color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20",
  },
  已取消: {
    label: "已取消",
    color: "text-slate-500 bg-slate-50 dark:bg-slate-800",
  },
};
