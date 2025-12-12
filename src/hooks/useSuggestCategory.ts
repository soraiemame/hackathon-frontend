import { useMutation } from "@tanstack/react-query";
import apiClient from "../api/client";

// APIに送信するデータの型
interface SuggestCategoryParams {
  title: string;
  description: string;
  image: File;
}

// APIから返ってくるレスポンスの型
interface SuggestResponse {
  category_id: number;
}

// APIリクエスト関数
async function suggestCategory(params: SuggestCategoryParams): Promise<number> {
  const formData = new FormData();
  formData.append("title", params.title);
  formData.append("description", params.description);
  formData.append("image", params.image);

  // 重要: 第3引数でヘッダー設定を行います
  const { data } = await apiClient.post<SuggestResponse>(
    "/api/items/suggest-category",
    formData,
    {
      headers: {
        // Axios等の場合、FormDataを渡すと自動で 'multipart/form-data' になりますが、
        // インターセプター等で 'application/json' が強制されていると422になります。
        // 明示的に指定することで回避します。
        // (注: 通常はブラウザがboundaryを自動付与するためヘッダー指定は不要ですが、
        //  422エラーが出る場合はこの指定を追加して試してください)
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return data.category_id;
}

export function useSuggestCategory() {
  return useMutation({
    mutationFn: suggestCategory,
  });
}
