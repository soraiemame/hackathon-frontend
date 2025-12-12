import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../api/client";
import { useAuth } from "../contexts/Auth";
import type { Like } from "../types/like"; // 修正
import { toast } from "sonner";

// --- API ---

// いいね数を取得
async function fetchLikeCount(itemId: string): Promise<number> {
  const { data } = await apiClient.get<number>(`/api/items/${itemId}/likes`);
  return data;
}

// 自分のいいね一覧を取得
async function fetchMyLikes(): Promise<Like[]> {
  // 修正
  const { data } = await apiClient.get<Like[]>("/api/users/me/likes");
  return data;
}

// いいねする
async function addLike(itemId: string): Promise<void> {
  await apiClient.post(`/api/items/${itemId}/like`);
}

// いいね解除する
async function removeLike(itemId: string): Promise<void> {
  await apiClient.delete(`/api/items/${itemId}/like`);
}

// --- Custom Hook ---

export function useItemLike(itemId: string | undefined) {
  const { isLoggedIn } = useAuth();
  const queryClient = useQueryClient();

  // 1. いいね数の取得
  const { data: likeCount = 0 } = useQuery({
    queryKey: ["itemLikeCount", itemId],
    queryFn: () => fetchLikeCount(itemId!),
    enabled: !!itemId,
  });

  // 2. 自分がいいね済みかどうかの取得
  const { data: myLikes } = useQuery({
    queryKey: ["myLikes"],
    queryFn: fetchMyLikes,
    enabled: isLoggedIn,
  });

  const isLiked =
    myLikes?.some((like) => like.item_id === Number(itemId)) || false;

  // 3. いいね切り替え
  const mutation = useMutation({
    mutationFn: () => {
      if (isLiked) {
        return removeLike(itemId!);
      } else {
        return addLike(itemId!);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["itemLikeCount", itemId] });
      queryClient.invalidateQueries({ queryKey: ["myLikes"] });
    },
    onError: () => {
      toast.error("操作失敗", { description: "いいねに失敗しました。" });
    },
  });

  return {
    likeCount,
    isLiked,
    toggleLike: mutation.mutate,
    isLikeProcessing: mutation.isPending,
  };
}
