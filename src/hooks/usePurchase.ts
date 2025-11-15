// src/hooks/usePurchase.ts

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import type { Order } from '../types/order';

// API
async function purchaseItem(itemId: string): Promise<Order> {
  const { data } = await apiClient.post(`/api/items/${itemId}/purchase`);
  return data;
}

// Custom Hook
export function usePurchase() {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: purchaseItem,
    onSuccess: (order) => {
      alert("購入が完了しました。取引ページに移動します。");
      navigate(`/orders/${order.id}`);
    },
    onError: (error: any) => {
      alert(`購入に失敗しました: ${error.response?.data?.detail || error.message}`);
    }
  });

  return {
    purchase: mutation.mutate,
    isPurchasing: mutation.isPending,
  };
}