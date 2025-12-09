import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';
import type { Category } from '../types/category';

async function fetchCategories(): Promise<Category[]> {
  const { data } = await apiClient.get('/api/categories');
  return data;
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: Infinity, // カテゴリーは頻繁に変わらないのでキャッシュ時間を長くする
  });
}