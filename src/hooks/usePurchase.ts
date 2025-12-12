// src/hooks/usePurchase.ts

import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client";
import type { Order } from "../types/order";
import axios from "axios";
import { toast } from "sonner";

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
      toast.success("購入完了", {
        description: "購入が完了しました。取引ページに移動します。",
      });
      navigate(`/orders/${order.id}`);
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        toast.error("購入失敗", {
          description: `購入に失敗しました: ${error.response?.data?.detail || error.message}`,
        });
      } else {
        alert("予期せぬエラーが発生しました。");
      }
    },
  });

  return {
    purchase: mutation.mutate,
    isPurchasing: mutation.isPending,
  };
}
