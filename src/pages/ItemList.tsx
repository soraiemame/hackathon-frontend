import { useState } from "react";
import { useItems } from "../hooks/useItems";

import { ItemCard } from "../components/item-card";
import { Button } from "../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";

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

  // --- 2. データ取得 & ロジック ---
  const { data: recommendedItems } = useRecommendations(isLoggedIn);
  const { data: items, isLoading } = useItems({
    sortBy: activeTab,
    categoryId: targetCategoryId,
  });

  // if (isLoading || isLoadingRec) return <FullPageLoader />;

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

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex flex-col gap-4 mb-6">
              <TabsList className="w-full sm:w-auto justify-start overflow-x-auto">
                <TabsTrigger value="new">新着</TabsTrigger>
                <TabsTrigger value="popular">人気</TabsTrigger>
                <TabsTrigger value="cheap">価格が安い順</TabsTrigger>
              </TabsList>

              {/* ▼ ここが消えないようにする！ */}
              <div className="w-full max-w-3xl">
                <CategorySelector
                  onChange={setTargetCategoryId}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-2"
                />
              </div>
            </div>

            <TabsContent value={activeTab} className="mt-0">
              {/* ▼▼▼ 修正: ロード中はこのエリアだけスピナーを出す ▼▼▼ */}
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
                    />
                  ))}
                  {items?.length === 0 && (
                    <div className="col-span-full text-center py-10 text-muted-foreground">
                      条件に一致する商品は見つかりませんでした。
                    </div>
                  )}
                </div>
              )}
              {/* ▲▲▲ 修正ここまで ▲▲▲ */}
            </TabsContent>
          </Tabs>
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
