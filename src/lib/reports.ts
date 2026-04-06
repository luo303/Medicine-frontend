// ==================== 数据类型定义 ====================

// 企业药品供应厂商
export interface Manufacturer {
  approval_no: string;
  name: string;
  city: string;
  address: string;
  postal_code: string;
  phone: string;
  is_gmp: boolean;
}

// 企业批准号药品目录
export interface Drug {
  approval_no: string;
  name: string;
  scientific_name: string;
  model: string;
  specification: string;
  is_prescription: boolean;
}

// 企业药品销售机构
export interface MedicalInstitution {
  approval_no: string;
  name: string;
  address: string;
  postal_code: string;
  phone: string;
  is_specialized: boolean;
}

// 采购订单
export interface PurchaseOrder {
  order_no: string;
  order_date: string;
  manufacturerApprovalNo: string;
  manufacturer_name: string;
  total_amount: string;
  purchaser: string;
  status: string;
  create_time: string;
  manufacturer?: Manufacturer;
  purchaseDetails?: PurchaseDetail[];
}

// 采购明细
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

// 采购入库
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
}

// 销售订单
export interface SalesOrder {
  order_no: string;
  sales_date: string;
  institutionApprovalNo: string;
  institution_name: string;
  manufacturerApprovalNo: string;
  manufacturer_name: string;
  total_amount: string;
  salesperson: string;
  status: string;
  create_time: string;
}

// 销售明细
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

// 销售出库
export interface SalesOutbound {
  id: number;
  warehouse_code: string;
  location_code: string;
  orderNo: string;
  outbound_date: string;
  institutionApprovalNo: string;
  manufacturerApprovalNo: string;
  drugApprovalNo: string;
  drug_name: string;
  production_date: string;
  quantity: number;
  salesperson: string;
  inspector: string;
  keeper: string;
}

// 药品库存
export interface Inventory {
  id: number;
  warehouse_code: string;
  location_code: string;
  manufacturerApprovalNo: string;
  drugApprovalNo: string;
  drug_name: string;
  batch_no: string;
  production_date: string;
  expiry_date: string;
  quantity: number;
  last_update: string;
  drug: Drug;
  warehouse: {
    id: number;
    code: string;
    name: string;
    address: string;
    manager: string;
  };
}
