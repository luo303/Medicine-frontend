import axios from "axios";

// 后端 NestJS 服务地址（根据实际部署情况修改）
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// 获取 token
function getToken() {
  return localStorage.getItem("auth_token");
}

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器，添加 token
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==================== 数据类型定义 ====================

// 企业药品供应厂商
export interface Manufacturer {
  approval_no: string; // 企业批准号
  name: string; // 企业名称
  city: string; // 所在城市
  address: string; // 地址
  postal_code: string; // 邮政编码
  phone: string; // 联系电话
  is_gmp: boolean; // 是否 GMP
}

// 企业批准号药品目录
export interface Drug {
  approval_no: string; // 药品批准号
  name: string; // 药品名称
  scientific_name: string; // 学名
  model: string; // 型号
  specification: string; // 规格
  is_prescription: boolean; // 是否处方药
}

// 企业药品销售机构
export interface MedicalInstitution {
  approval_no: string; // 机构批准号
  name: string; // 机构名称
  address: string; // 地址
  postal_code: string; // 邮政编码
  phone: string; // 联系电话
  is_specialized: boolean; // 是否专科医院
}

// 采购订单
export interface PurchaseOrder {
  order_no: string; // 采购单号
  order_date: string; // 采购日期
  manufacturerApprovalNo: string; // 企业批准号
  manufacturer_name: string; // 企业名称
  total_amount: string; // 总金额
  purchaser: string; // 采购员
  status: string; // 状态
  create_time: string; // 创建时间
  manufacturer?: Manufacturer;
  purchaseDetails?: PurchaseDetail[];
}

// 采购明细
export interface PurchaseDetail {
  id: number;
  orderNo: string; // 采购单号
  drugApprovalNo: string; // 药品批准号
  drug_name: string; // 药品名称
  production_date: string; // 生产日期
  validity_months: number; // 有效期（月）
  quantity: number; // 采购数量
  unit_price: string; // 采购单价
  amount: string; // 采购金额
}

// 采购入库
export interface PurchaseStorage {
  id: number;
  warehouse_code: string; // 仓号
  location_code: string; // 货位号
  orderNo: string; // 采购单号
  storage_date: string; // 入库日期
  manufacturerApprovalNo: string; // 企业批准号
  drugApprovalNo: string; // 药品批准号
  drug_name: string; // 药品名称
  production_date: string; // 生产日期
  expiry_date: string; // 有效截止日期
  quantity: number; // 入库数量
  purchaser: string; // 采购员
  inspector: string; // 检验员
  keeper: string; // 保管员
}

// 销售订单
export interface SalesOrder {
  order_no: string; // 销售单号
  sales_date: string; // 销售日期
  institutionApprovalNo: string; // 机构批准号
  institution_name: string; // 机构名称
  manufacturerApprovalNo: string; // 企业批准号
  manufacturer_name: string; // 企业名称
  total_amount: string; // 总金额
  salesperson: string; // 销售员
  status: string; // 状态
  create_time: string; // 创建时间
}

// 销售明细
export interface SalesDetail {
  id: number;
  orderNo: string; // 销售单号
  manufacturerApprovalNo: string; // 企业批准号
  drugApprovalNo: string; // 药品批准号
  drug_name: string; // 药品名称
  production_date: string; // 生产日期
  quantity: number; // 销售数量
  unit_price: string; // 销售单价
  amount: string; // 销售金额
}

// 销售出库
export interface SalesOutbound {
  id: number;
  warehouse_code: string; // 仓号
  location_code: string; // 货位号
  orderNo: string; // 销售单号
  outbound_date: string; // 出库日期
  institutionApprovalNo: string; // 机构批准号
  manufacturerApprovalNo: string; // 企业批准号
  drugApprovalNo: string; // 药品批准号
  drug_name: string; // 药品名称
  production_date: string; // 生产日期
  quantity: number; // 出库数量
  salesperson: string; // 销售员
  inspector: string; // 检验员
  keeper: string; // 保管员
}

// 药品库存
export interface Inventory {
  id: number;
  warehouse_code: string; // 仓号
  location_code: string; // 货位号
  manufacturerApprovalNo: string; // 企业批准号
  drugApprovalNo: string; // 药品批准号
  drug_name: string; // 药品名称
  batch_no: string; // 批次号
  production_date: string; // 生产日期
  expiry_date: string; // 有效截止日期
  quantity: number; // 库存数量
  last_update: string; // 最后更新时间
  drug: Drug;
  warehouse: {
    id: number;
    code: string;
    name: string;
    address: string;
    manager: string;
  };
}

// 通用响应类型
export interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

// ==================== API 接口 ====================

// 获取企业药品供应厂商列表
export async function getManufacturers(): Promise<Manufacturer[]> {
  const response =
    await apiClient.get<ApiResponse<Manufacturer[]>>("/manufacturer");
  return response.data.data;
}

// 获取企业批准号药品目录
export async function getDrugs(): Promise<Drug[]> {
  const response = await apiClient.get<ApiResponse<Drug[]>>("/drug");
  return response.data.data;
}

// 获取企业药品销售机构列表
export async function getMedicalInstitutions(): Promise<MedicalInstitution[]> {
  const response = await apiClient.get<ApiResponse<MedicalInstitution[]>>(
    "/MedicalInstitution",
  );
  return response.data.data;
}

// 获取采购订单列表
export async function getPurchaseOrders(): Promise<PurchaseOrder[]> {
  const response =
    await apiClient.get<ApiResponse<PurchaseOrder[]>>("/purchase/order");
  return response.data.data;
}

// 获取采购订单详情
export async function getPurchaseOrderDetail(
  orderNo: string,
): Promise<PurchaseOrder> {
  const response = await apiClient.get<ApiResponse<PurchaseOrder>>(
    `/purchase/order/${orderNo}`,
  );
  return response.data.data;
}

// 获取采购明细列表
export async function getPurchaseDetails(): Promise<PurchaseDetail[]> {
  const response =
    await apiClient.get<ApiResponse<PurchaseDetail[]>>("/purchase/detail");
  return response.data.data;
}

// 获取采购明细详情
export async function getPurchaseDetailDetail(
  id: number,
): Promise<PurchaseDetail> {
  const response = await apiClient.get<ApiResponse<PurchaseDetail>>(
    `/purchase/detail/${id}`,
  );
  return response.data.data;
}

// 获取采购入库记录
export async function getPurchaseStorages(): Promise<PurchaseStorage[]> {
  const response =
    await apiClient.get<ApiResponse<PurchaseStorage[]>>("/purchase/storage");
  return response.data.data;
}

// 获取采购入库详情
export async function getPurchaseStorageDetail(
  id: number,
): Promise<PurchaseStorage> {
  const response = await apiClient.get<ApiResponse<PurchaseStorage>>(
    `/purchase/storage/${id}`,
  );
  return response.data.data;
}

// 获取销售订单列表
export async function getSalesOrders(): Promise<SalesOrder[]> {
  const response =
    await apiClient.get<ApiResponse<SalesOrder[]>>("/sales/order");
  return response.data.data;
}

// 获取销售订单详情
export async function getSalesOrderDetail(
  orderNo: string,
): Promise<SalesOrder> {
  const response = await apiClient.get<ApiResponse<SalesOrder>>(
    `/sales/order/${orderNo}`,
  );
  return response.data.data;
}

// 获取销售出库记录
export async function getSalesOutbounds(): Promise<SalesOutbound[]> {
  const response =
    await apiClient.get<ApiResponse<SalesOutbound[]>>("/sales/outbound");
  return response.data.data;
}

// 获取销售出库详情
export async function getSalesOutboundDetail(
  id: number,
): Promise<SalesOutbound> {
  const response = await apiClient.get<ApiResponse<SalesOutbound>>(
    `/sales/outbound/${id}`,
  );
  return response.data.data;
}

// 获取药品库存列表
export async function getInventory(): Promise<Inventory[]> {
  const response = await apiClient.get<ApiResponse<Inventory[]>>("/inventory");
  return response.data.data;
}
