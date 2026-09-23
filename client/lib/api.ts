const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5277";

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  return res.json();
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PagedGameAccountsResponse {
  items: ApiGameAccount[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface ApiGameAccount {
  id: number;
  accountName: string;
  accountType: string;
  region: string;
  moneySpent: number;
  gameMoneySpent: number;
  gameCurrency: string;
  numberOfSkins: number;
  accountLink: string;
  rank?: string;
  level?: number;
  sellerId: number;
  sellerName: string;
  price: number;
  sellingPriceCurrency: string;
  featured: boolean;
  description?: string;
  verificationStatus: string;
  transactionStatus: string;
  buyerId?: number;
  buyerName?: string;
  images: string[];
  createdDate: string;
  lastUpdated: string;
  skins: ApiGameAccountSkin[];
}

export interface ApiGameAccountSkin {
  id: number;
  name: string;
  weaponType: string;
  skinType: string;
  price: number;
  currency: string;
  imageUrl?: string;
  rarity?: string;
}

export interface GetGameAccountsParams {
  searchTerm?: string;
  accountType?: string;
  transactionStatus?: string;
  featured?: boolean;
  sellerId?: number;
}

export function fetchGameAccounts(params: GetGameAccountsParams = {}) {
  const qs = new URLSearchParams();
  if (params.searchTerm) qs.set("searchTerm", params.searchTerm);
  if (params.accountType) qs.set("accountType", params.accountType);
  if (params.transactionStatus) qs.set("transactionStatus", params.transactionStatus);
  if (params.featured !== undefined) qs.set("featured", String(params.featured));
  if (params.sellerId !== undefined) qs.set("sellerId", String(params.sellerId));

  return apiFetch<ApiResponse<PagedGameAccountsResponse>>(`/api/GameAccounts?${qs}`);
}
