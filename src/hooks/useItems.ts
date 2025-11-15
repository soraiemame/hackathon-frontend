// src/hooks/useItems.ts

import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';
import type { Item } from '../types/item';

/**
 * /api/items 
 */
async function fetchItems(): Promise<Item[]> {
  const { data } = await apiClient.get('/api/items');
  return data;
}

/**
 * */
export function useItems() {
  return useQuery({
    queryKey: ['items'],
    queryFn: fetchItems,
  });
}