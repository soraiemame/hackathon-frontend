import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../api/client";
import type { Item } from "../types/item";
import type { Comment, CommentCreate } from "../types/comment";
import type { User } from "../types/user";
import axios from "axios";
import { toast } from "sonner";

// --- API (変更なし)
async function fetchItem(itemId: string): Promise<Item> {
  const { data } = await apiClient.get(`/api/items/${itemId}`);
  return data;
}

async function fetchComments(itemId: string): Promise<Comment[]> {
  const { data } = await apiClient.get(`/api/items/${itemId}/comments`);
  return data;
}

async function fetchUser(userId: number): Promise<User> {
  const { data } = await apiClient.get(`/api/users/${userId}`);
  return data;
}

async function fetchMyProfile(): Promise<User> {
  const { data } = await apiClient.get("/api/users/me");
  return data;
}

async function postComment(vars: {
  itemId: string;
  data: CommentCreate;
}): Promise<Comment> {
  const { data } = await apiClient.post(
    `/api/items/${vars.itemId}/comments`,
    vars.data,
  );
  return data;
}

async function deleteComment(vars: {
  itemId: string;
  commentId: number;
}): Promise<void> {
  await apiClient.delete(
    `/api/items/${vars.itemId}/comments/${vars.commentId}`,
  );
}

// ---

export function useItem(itemId: string | undefined) {
  // ← 修正
  return useQuery({
    queryKey: ["itemDetail", itemId],
    // queryFnは enabled: true の時（itemIdがstringの時）しか実行されない
    queryFn: () => fetchItem(itemId!),
    enabled: !!itemId, // itemIdが存在する場合のみクエリを実行
  });
}

/**
 * */
// (このフックは元から undefined 対応済みのため変更なし)
export function useItemSeller(item: Item | undefined) {
  return useQuery({
    queryKey: ["userProfile", item?.seller_id],
    // queryFnは enabled: true の時（itemが存在する時）しか実行されない
    queryFn: () => fetchUser(item!.seller_id),
    enabled: !!item, // itemが存在する場合のみクエリを実行
    retry: (failureCount, error) => {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return false; // 404なら即座に諦める（エラーにする）
      }
      return failureCount < 3; // それ以外なら3回まで粘る
    },
  });
}

export function useItemComments(itemId: string | undefined) {
  // ← 修正
  const queryClient = useQueryClient();

  const commentsQuery = useQuery({
    queryKey: ["itemComments", itemId],
    // queryFnは enabled: true の時（itemIdがstringの時）しか実行されない
    queryFn: () => fetchComments(itemId!),
    enabled: !!itemId, // itemIdが存在する場合のみクエリを実行
  });

  const postCommentMutation = useMutation({
    mutationFn: postComment,
    onSuccess: () => {
      // itemIdが存在する場合（= このクエリが有効な場合）のみinvalidate
      if (itemId) {
        queryClient.invalidateQueries({ queryKey: ["itemComments", itemId] });
      }
    },
    onError: () => {
      toast.error("投稿失敗", {
        description: "コメントの投稿に失敗しました。",
      });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      if (itemId) {
        queryClient.invalidateQueries({ queryKey: ["itemComments", itemId] });
      }
    },
    onError: () => {
      toast.error("削除失敗", {
        description: "コメントの削除に失敗しました。",
      });
    },
  });

  return {
    commentsQuery,
    postComment: postCommentMutation.mutate,
    isPostingComment: postCommentMutation.isPending,
    deleteComment: deleteCommentMutation.mutate,
    isDeletingComment: deleteCommentMutation.isPending,
  };
}

// (このフックは引数を取らないため変更なし)
export function useCurrentUser() {
  return useQuery({
    queryKey: ["myProfile"],
    queryFn: fetchMyProfile,
  });
}
