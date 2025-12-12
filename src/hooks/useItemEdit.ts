import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client";
import type { Item, ItemCreate } from "../types/item";
import { toast } from "sonner";

// --- API
async function fetchItem(itemId: string): Promise<Item> {
  const { data } = await apiClient.get(`/api/items/${itemId}`);
  return data;
}

async function updateItem(vars: {
  itemId: string;
  data: ItemCreate;
}): Promise<Item> {
  const { data } = await apiClient.put(`/api/items/${vars.itemId}`, vars.data);
  return data;
}

// --- Custom Hook ---
export function useItemEdit(itemId: string | undefined) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 1.
  const query = useQuery({
    queryKey: ["itemDetail", itemId],
    queryFn: () => fetchItem(itemId!),
    enabled: !!itemId,
  });

  // 2.
  const mutation = useMutation({
    mutationFn: updateItem,
    onSuccess: (updatedItem) => {
      //
      queryClient.invalidateQueries({
        queryKey: ["itemDetail", updatedItem.id],
      });
      queryClient.invalidateQueries({ queryKey: ["items"] });
      navigate(`/items/${updatedItem.id}`);
    },
    onError: () => {
      toast.error("更新失敗",{"description": "商品の更新に失敗しました。"});
    },
  });

  return {
    query,
    mutation,
  };
}
