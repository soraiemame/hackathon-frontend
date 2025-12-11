// src/hooks/useCreateItem.ts

import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client";
import axios from "axios";
import type { Item, ItemCreate } from "../types/item";
import type { SignedUrlResponse } from "../types/storage";

// --- API Helper Functions ---

async function getSignedUrl(
  file: File,
): Promise<{ uploadUrl: string; fileKey: string; file: File }> {
  const { data } = await apiClient.post<SignedUrlResponse>(
    "/api/items/generate-signed-url",
    {
      filename: file.name,
      content_type: file.type,
    },
  );
  return { uploadUrl: data.upload_url, fileKey: data.file_key, file: file };
}

async function uploadToGCS(vars: {
  uploadUrl: string;
  file: File;
}): Promise<void> {
  await axios.put(vars.uploadUrl, vars.file, {
    headers: { "Content-Type": vars.file.type },
  });
}

async function createItemInDB(itemData: ItemCreate): Promise<Item> {
  const { data } = await apiClient.post<Item>("/api/items", itemData);
  return data;
}

// --- Custom Hook ---

interface CreateItemVariables {
  name: string;
  price: number;
  description: string;
  condition: number;
  category_id: number;
  files: File[];
}

/**
 * 商品出品の全ロジック（署名URL取得、GCSアップロード、DB保存）を管理するカスタムフック
 */
export function useCreateItem() {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (vars: CreateItemVariables) => {
      // 1.
      const signedUrlPromises = vars.files.map((file) => getSignedUrl(file));
      const signedUrlResults = await Promise.all(signedUrlPromises);

      // 2.
      const uploadPromises = signedUrlResults.map((result) =>
        uploadToGCS({ uploadUrl: result.uploadUrl, file: result.file }),
      );
      await Promise.all(uploadPromises);

      // 3.
      const itemData: ItemCreate = {
        name: vars.name,
        price: vars.price,
        description: vars.description,
        condition: vars.condition,
        category_id: vars.category_id,
        image_keys: signedUrlResults.map((result) => result.fileKey),
      };
      console.log(itemData);
      const createdItem = await createItemInDB(itemData);

      return createdItem;
    },
    onSuccess: (createdItem) => {
      //
      navigate(`/items/${createdItem.id}`);
    },
    onError: (error) => {
      console.error(error);
      alert("出品に失敗しました。");
    },
  });

  return {
    createItem: mutation.mutate,
    isLoading: mutation.isPending,
  };
}
