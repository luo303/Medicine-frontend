"use cache";
import { cacheLife } from "next/cache";
import type {
  Manufacturer,
  Drug,
  MedicalInstitution,
  Warehouse,
  StorageLocation,
} from "@/types/basic-data";

const API_BASE_URL = "http://localhost:3001/api";

interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

async function fetchApi<T>(endpoint: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(`API Error: ${response.status} for ${endpoint}`);
      return null;
    }

    const result: ApiResponse<T> = await response.json();
    return result.data;
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error);
    return null;
  }
}

export async function getManufacturers(): Promise<Manufacturer[]> {
  "use cache";
  cacheLife("minutes");
  const data = await fetchApi<Manufacturer[]>("/manufacturer");
  return data || [];
}

export async function getDrugs(): Promise<Drug[]> {
  "use cache";
  cacheLife("minutes");
  const data = await fetchApi<Drug[]>("/drug");
  return data || [];
}

export async function getMedicalInstitutions(): Promise<MedicalInstitution[]> {
  "use cache";
  cacheLife("minutes");
  const data = await fetchApi<MedicalInstitution[]>("/MedicalInstitution");
  return data || [];
}

export async function getWarehouses(): Promise<Warehouse[]> {
  "use cache";
  cacheLife("minutes");
  const data = await fetchApi<Warehouse[]>("/warehouse");
  return data || [];
}

export async function getStorageLocations(): Promise<StorageLocation[]> {
  "use cache";
  cacheLife("minutes");
  const data = await fetchApi<StorageLocation[]>("/storage-location");
  return data || [];
}
