import { useMutation } from '@tanstack/react-query';
import apiClient from '../api/client';

interface SuggestPriceParams {
  title: string;
  description: string;
  condition: number;
  image: File;
}

interface SuggestPriceResponse {
  price_min: number;
  price_max: number;
  suggested_price: number;
  reason: string;
}

async function suggestPrice(params: SuggestPriceParams): Promise<SuggestPriceResponse> {
  const formData = new FormData();
  formData.append('title', params.title);
  formData.append('description', params.description);
  formData.append('condition', String(params.condition));
  formData.append('image', params.image);

  const { data } = await apiClient.post<SuggestPriceResponse>(
    '/api/items/suggest-price',
    formData,
    {
      headers: {
        // 422エラー対策: boundary自動生成のため明示的にundefinedにするか
        // ブラウザ任せにする設定
        'Content-Type': undefined, 
      } as any,
    }
  );

  return data;
}

export function useSuggestPrice() {
  return useMutation({
    mutationFn: suggestPrice,
  });
}