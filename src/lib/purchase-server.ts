import type {
  PurchaseOrder,
  PurchaseDetail,
  PurchaseStorage,
} from "@/types/purchase";
import { cacheTag, cacheLife } from "next/cache";

const API_BASE = "http://localhost:3001/api";

async function fetchApi<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  const result = await response.json();
  return result.data;
}

export async function getPurchaseOrders(): Promise<PurchaseOrder[]> {
  "use cache";
  cacheTag("purchase-orders");
  cacheLife("minutes");
  return fetchApi<PurchaseOrder[]>("/purchase/order");
}

export async function getPurchaseOrder(
  orderNo: string
): Promise<PurchaseOrder> {
  "use cache";
  cacheTag("purchase-order", `purchase-order-${orderNo}`);
  cacheLife("minutes");
  return fetchApi<PurchaseOrder>(`/purchase/order/${orderNo}`);
}

export async function getPurchaseDetails(): Promise<PurchaseDetail[]> {
  "use cache";
  cacheTag("purchase-details");
  cacheLife("minutes");
  return fetchApi<PurchaseDetail[]>("/purchase/detail");
}

export async function getPurchaseDetail(id: number): Promise<PurchaseDetail> {
  "use cache";
  cacheTag("purchase-detail", `purchase-detail-${id}`);
  cacheLife("minutes");
  return fetchApi<PurchaseDetail>(`/purchase/detail/${id}`);
}

export async function getPurchaseStorages(): Promise<PurchaseStorage[]> {
  "use cache";
  cacheTag("purchase-storages");
  cacheLife("minutes");
  return fetchApi<PurchaseStorage[]>("/purchase/storage");
}

export async function getPurchaseStorage(id: number): Promise<PurchaseStorage> {
  "use cache";
  cacheTag("purchase-storage", `purchase-storage-${id}`);
  cacheLife("minutes");
  return fetchApi<PurchaseStorage>(`/purchase/storage/${id}`);
}
