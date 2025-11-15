// src/hooks/useUserProfile.ts

import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';
import type { User } from '../types/user';
import type { Item } from '../types/item';

// --- API 
async function fetchUser(userId: string): Promise<User> {
  const { data } = await apiClient.get(`/api/users/${userId}`);
  return data;
}

async function fetchUserItems(userId: string): Promise<Item[]> {
  const { data } = await apiClient.get('/api/items', {
      params: { seller_id: userId }
  });
  return data;
}

// --- Custom Hooks ---

export function useUser(userId: string | undefined) {
  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => fetchUser(userId!),
    enabled: !!userId, // 
  });
}

export function useUserItems(userId: string | undefined) {
  return useQuery({
    queryKey: ['userItems', userId],
    queryFn: () => fetchUserItems(userId!),
    enabled: !!userId, // 
  });
}