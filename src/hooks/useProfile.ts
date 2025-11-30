import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';
import axios from 'axios';
import type { User, UserUpdate } from '../types/user';
import type { SignedUrlResponse } from '../types/storage';

async function getSignedUrl(file: File): Promise<{ uploadUrl: string, fileKey: string }> {
    const { data } = await apiClient.post<SignedUrlResponse>('/api/users/generate-signed-url', {
        filename: file.name,
        content_type: file.type,
    });
    return { uploadUrl: data.upload_url, fileKey: data.file_key };
}

async function uploadToGCS(uploadUrl: string, file: File) {
    await axios.put(uploadUrl, file, {
        headers: { 'Content-Type': file.type },
    });
}

async function updateProfileInDB(data: UserUpdate): Promise<User> {
    const { data: updatedUser } = await apiClient.put(`/api/users/me`, data);
    return updatedUser;
}

export function useProfileUpdate() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (vars: { userId: number, username: string, file?: File }) => {
            let iconKey: string | undefined;

            // 画像がある場合のみアップロード処理
            if (vars.file) {
                const { uploadUrl, fileKey } = await getSignedUrl(vars.file);
                await uploadToGCS(uploadUrl, vars.file);
                iconKey = fileKey;
            }

            const updateData: UserUpdate = {
                username: vars.username,
                ...(iconKey && { icon_key: iconKey }), // iconKeyがある場合のみ追加
            };

            return await updateProfileInDB(updateData);
        },
        onSuccess: (updatedUser) => {
            queryClient.setQueryData(['myProfile'], updatedUser);
            alert("プロフィールを更新しました。");
        },
        onError: () => {
            alert("更新に失敗しました。");
        }
    });
}