// src/hooks/useOrderDetail.ts

import { useQuery } from "@tanstack/react-query";
import apiClient from "../api/client";
import type { Order } from "../types/order";
import type { User } from "../types/user";
import axios from "axios";

// --- API
async function fetchOrder(orderId: string): Promise<Order> {
  const { data } = await apiClient.get(`/api/orders/${orderId}`);
  return data;
}

async function fetchUser(userId: number): Promise<User> {
  const { data } = await apiClient.get(`/api/users/${userId}`);
  return data;
}

// --- Custom Hooks ---

/**
 * */
export function useOrder(orderId: string | undefined) {
  return useQuery({
    queryKey: ["orderDetail", orderId],
    queryFn: () => fetchOrder(orderId!),
    enabled: !!orderId,
  });
}

/**
 * */
export function useOrderPartner(
  order: Order | undefined,
  myUserId: number | undefined,
) {
  //
  const isPurchase = order?.buyer_id === myUserId;
  const partnerId = isPurchase ? order?.seller_id : order?.buyer_id;

  return useQuery({
    queryKey: ["userProfile", partnerId],
    queryFn: () => fetchUser(partnerId!),
    enabled: !!partnerId,
    retry: (failureCount, error) => {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return false; // 404なら即座に諦める（エラーにする）
      }
      return failureCount < 3; // それ以外なら3回まで粘る
    },
  });
}
