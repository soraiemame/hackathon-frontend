// src/hooks/useItemSearch.ts

import { useQuery } from "@tanstack/react-query";
import apiClient from "../api/client";
import type { Item } from "../types/item";

// --- API ---
async function searchItems(query: string): Promise<Item[]> {
  const { data } = await apiClient.get(`/api/items`, {
    params: { search: query },
  });
  return data;
}

// --- Custom Hook ---
export function useItemSearch(query: string) {
  return useQuery({
    queryKey: ["itemSearch", query],
    queryFn: () => searchItems(query),
    enabled: !!query, //
  });
}
