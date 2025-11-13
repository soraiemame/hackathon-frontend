import { useState, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import axios from 'axios';

import type { Item, ItemCreate } from '../types/item';
import type { SignedUrlResponse } from '../types/storage';

// 
async function getSignedUrl(vars: { file: File }): Promise<{ uploadUrl: string, fileKey: string, file: File }> {
    const { data } = await apiClient.post<SignedUrlResponse>('/api/items/generate-signed-url', {
        filename: vars.file.name,
        content_type: vars.file.type,
    });
    return { uploadUrl: data.upload_url, fileKey: data.file_key, file: vars.file };
}

// 2. GCS
async function uploadToGCS(vars: { uploadUrl: string, file: File, fileKey: string }) {
    await axios.put(vars.uploadUrl, vars.file, {
        headers: {
            'Content-Type': vars.file.type,
        },
    });
    // 
    return { fileKey: vars.fileKey };
}

// 3. FastAPI
async function createItemInDB(vars: { itemData: ItemCreate }): Promise<Item> {
    const { data } = await apiClient.post<Item>('/api/items', vars.itemData);
    return data;
}

export function ItemCreate() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const imageInputRef = useRef<HTMLInputElement>(null);

    // 
    const dbMutation = useMutation({
        mutationFn: createItemInDB,
        onSuccess: (createdItem) => {
            navigate(`/items/${createdItem.id}`);
        },
        onError: () => {
            alert("DBへの保存に失敗しました。");
        }
    });

    // 
    const gcsMutation = useMutation({
        mutationFn: uploadToGCS,
        onSuccess: (data) => {
            dbMutation.mutate({ 
                itemData: {
                    name: name,
                    price: price,
                    description: description,
                    image_keys: [data.fileKey] // 
                }
            });
        },
        onError: () => {
             alert("GCSへのアップロードに失敗しました。");
        }
    });

    // 
    const signedUrlMutation = useMutation({
        mutationFn: getSignedUrl,
        onSuccess: (data) => {
            gcsMutation.mutate({ uploadUrl: data.uploadUrl, file: data.file, fileKey: data.fileKey });
        },
        onError: () => {
            alert("署名付きURLの取得に失敗しました。");
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const file = imageInputRef.current?.files?.[0];

        if (!file) {
            alert("画像を選択してください。");
            return;
        }
        
        signedUrlMutation.mutate({ file });
    };

    const isLoading = signedUrlMutation.isPending || gcsMutation.isPending || dbMutation.isPending;

    return (
        <form onSubmit={handleSubmit}>
            <h1>商品を出品する</h1>
            
            <div>
                <label>商品名:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            
            <div>
                <label>価格:</label>
                <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} required />
            </div>
            
            <div>
                <label>商品説明:</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div>
                <label>画像 (1枚):</label>
                <input type="file" ref={imageInputRef} accept="image/*" required />
            </div>
            
            <button type="submit" disabled={isLoading}>
                {isLoading ? '出品中...' : '出品する'}
            </button>
        </form>
    );
}
