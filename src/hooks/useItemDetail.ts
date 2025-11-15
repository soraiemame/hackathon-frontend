import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';
import type { Item } from '../types/item';
import type { Comment, CommentCreate } from '../types/comment';
import type { User } from '../types/user';

// --- API 
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
    const { data } = await apiClient.get('/api/users/me');
    return data;
}

async function postComment(vars: { itemId: string, data: CommentCreate }): Promise<Comment> {
    const { data } = await apiClient.post(`/api/items/${vars.itemId}/comments`, vars.data);
    return data;
}

async function deleteComment(vars: { itemId: string, commentId: number }): Promise<void> {
    await apiClient.delete(`/api/items/${vars.itemId}/comments/${vars.commentId}`);
}

// --- 

export function useItem(itemId: string) {
    return useQuery({
        queryKey: ['itemDetail', itemId],
        queryFn: () => fetchItem(itemId),
        enabled: !!itemId,
    });
}

/**
 * */
export function useItemSeller(item: Item | undefined) {
    return useQuery({
      queryKey: ['userProfile', item?.seller_id], 
      queryFn: () => fetchUser(item!.seller_id), 
      enabled: !!item, 
  });
}

export function useItemComments(itemId: string) {
    const queryClient = useQueryClient();

    const commentsQuery = useQuery({
        queryKey: ['itemComments', itemId],
        queryFn: () => fetchComments(itemId),
        enabled: !!itemId,
    });

    const postCommentMutation = useMutation({
        mutationFn: postComment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['itemComments', itemId] });
        },
        onError: () => {
            alert('コメントの投稿に失敗しました。');
        }
    });

    const deleteCommentMutation = useMutation({
        mutationFn: deleteComment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['itemComments', itemId] });
        },
        onError: () => {
            alert('コメントの削除に失敗しました。');
        }
    });

    return {
        commentsQuery,
        postComment: postCommentMutation.mutate,
        isPostingComment: postCommentMutation.isPending,
        deleteComment: deleteCommentMutation.mutate,
        isDeletingComment: deleteCommentMutation.isPending,
    };
}

export function useCurrentUser() {
    return useQuery({
        queryKey: ['myProfile'],
        queryFn: fetchMyProfile,
    });
}