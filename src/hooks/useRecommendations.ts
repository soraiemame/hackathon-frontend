import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';
import type { Item } from '../types/item';

async function fetchRecommendations(): Promise<Item[]> {
  // バックエンドのエンドポイント (前回の /api/recommendations/me)
  const { data } = await apiClient.get('/api/recommendations/me');
  return data;
}

export function useRecommendations(enabled: boolean) {
  return useQuery({
    queryKey: ['recommendations'],
    queryFn: fetchRecommendations,
    enabled: enabled, // ログインしている時だけ有効にする
    staleTime: 1000 * 60 * 5, // 5分間キャッシュ (頻繁に変わらないため)
  });
}