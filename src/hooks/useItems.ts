import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';
import type { Item } from '../types/item';

// フックが受け取るパラメータの型定義
export interface UseItemsParams {
  sortBy?: string;      // "new", "price-low", "popular" など
  categoryId?: number;  // カテゴリーID
}

// API呼び出し関数
async function fetchItems(params: UseItemsParams): Promise<Item[]> {
  const queryParams: Record<string, any> = {};
  
  // 1. ソート順のマッピング (Frontend用文字列 -> Backend用Enum)
  if (params.sortBy) {
    queryParams.sort_by = params.sortBy;
  }

  // 2. カテゴリーIDの指定
  if (params.categoryId) {
      queryParams.category_id = params.categoryId;
  }

  // 3. APIリクエスト (クエリパラメータ付き)
  const { data } = await apiClient.get('/api/items', {
    params: queryParams
  });
  
  return data;
}

// カスタムフック
export function useItems(params: UseItemsParams = {}) {
  return useQuery({
    // queryKeyにparamsを含めることで、
    // ソート順やカテゴリーが変わった瞬間に自動で再取得(Refetch)が走ります
    queryKey: ['items', params], 
    queryFn: () => fetchItems(params),
  });
}