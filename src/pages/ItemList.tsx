import { useState } from "react";
import { useItems } from "../hooks/useItems";

import { ItemCard } from "../components/item-card";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

import { useRecommendations } from "../hooks/useRecommendations"; // ▼ 追加
import { useAuth } from "../contexts/Auth"; // ▼ 追加
import { Loader2, Sparkles } from "lucide-react";

import { CategorySelector } from "../components/category-selector";

export function ItemList() {
  const { isLoggedIn, user } = useAuth();
  // --- 1. 状態管理 ---
  const [activeTab, setActiveTab] = useState("new");

  const [targetCategoryId, setTargetCategoryId] = useState<number | undefined>(
    undefined,
  );
  // 売り切れ商品を除外するかどうかの状態
  const [excludeSold, setExcludeSold] = useState(false);

  // --- 2. データ取得 & ロジック ---
  const { data: recommendedItems } = useRecommendations(isLoggedIn);
  const { data: items, isLoading } = useItems({
    sortBy: activeTab,
    categoryId: targetCategoryId,
    includeSold: !excludeSold, // チェックが入っていたら false (含めない)
  });

  return (
    <div className="container px-4 py-8 md:px-6">
      <div className="flex flex-col gap-6">
        {isLoggedIn && recommendedItems && recommendedItems.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <h2 className="text-xl font-bold">
                {user?.username ? `${user.username}さんへの` : ""}おすすめ
              </h2>
            </div>

            {/* 横スクロールエリア */}
            <div className="relative">
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                {recommendedItems.map((item) => (
                  <div
                    key={item.id}
                    className="min-w-[160px] w-[160px] sm:min-w-[200px] sm:w-[200px] snap-start"
                  >
                    <ItemCard
                      id={item.id}
                      name={item.name}
                      price={item.price}
                      image={item.images[0]?.image_url}
                      isSold={!item.selling}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
        {/* メインリスト */}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">すべての商品</h1>

          {/* フィルター＆ソートエリア - Search.tsxと統一感を持たせる */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                {/* ソート選択 */}
                <Select value={activeTab} onValueChange={setActiveTab}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="並び替え" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">新着順</SelectItem>
                    <SelectItem value="popular">人気順</SelectItem>
                    <SelectItem value="cheap">価格が安い順</SelectItem>
                  </SelectContent>
                </Select>

                {/* 売り切れ除外スイッチ */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="excludeSold"
                    checked={excludeSold}
                    onChange={(e) => setExcludeSold(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label
                    htmlFor="excludeSold"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    売り切れ商品を除外する
                  </label>
                </div>
              </div>
            </div>

            {/* カテゴリーセレクター */}
            <div className="w-full max-w-3xl">
              <CategorySelector
                onChange={setTargetCategoryId}
              />
            </div>
          </div>

          {/* アイテムリスト表示エリア */}
          <div className="mt-0">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {items?.map((item) => (
                  <ItemCard
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    price={item.price}
                    image={item.images[0]?.image_url}
                    isSold={!item.selling}
                  />
                ))}
                {items?.length === 0 && (
                  <div className="col-span-full text-center py-10 text-muted-foreground">
                    条件に一致する商品は見つかりませんでした。
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {!isLoading && items && items.length > 0 && (
          <div className="flex justify-center mt-8">
            <Button variant="outline" size="lg">
              もっと見る
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
