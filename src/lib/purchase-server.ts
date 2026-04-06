import type {
  PurchaseOrder,
  PurchaseDetail,
  PurchaseStorage,
} from "@/types/purchase";

const API_BASE = "http://localhost:3001/api";

async function fetchApi<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  const result = await response.json();
  return result.data;
}

export async function getPurchaseOrders(): Promise<PurchaseOrder[]> {
  return fetchApi<PurchaseOrder[]>("/purchase/order");
}

export async function getPurchaseOrder(
  orderNo: string,
): Promise<PurchaseOrder> {
  return fetchApi<PurchaseOrder>(`/purchase/order/${orderNo}`);
}

export async function getPurchaseDetails(): Promise<PurchaseDetail[]> {
  return fetchApi<PurchaseDetail[]>("/purchase/detail");
}

export async function getPurchaseDetail(id: number): Promise<PurchaseDetail> {
  return fetchApi<PurchaseDetail>(`/purchase/detail/${id}`);
}

export async function getPurchaseStorages(): Promise<PurchaseStorage[]> {
  return fetchApi<PurchaseStorage[]>("/purchase/storage");
}

export async function getPurchaseStorage(id: number): Promise<PurchaseStorage> {
  return fetchApi<PurchaseStorage>(`/purchase/storage/${id}`);
}
