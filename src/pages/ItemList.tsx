import { useState, useMemo } from "react";
import { useItems } from "../hooks/useItems";
import { useCategories } from "../hooks/useCategory"; // hooks/useCategory ではなく複数形推奨

import { ItemCard } from "../components/item-card";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { FullPageLoader } from "../components/ui/full-page-loader";

export function ItemList() {
  // --- 1. 状態管理 ---
  const [activeTab, setActiveTab] = useState("new"); 

  // カテゴリー選択状態
  const [selectedC0, setSelectedC0] = useState<string>("all");
  const [selectedC1, setSelectedC1] = useState<string>("all");
  const [selectedC2, setSelectedC2] = useState<string>("all");

  // --- 2. データ取得 & ロジック ---
  const { data: categories } = useCategories();
  
  // APIに送るカテゴリーIDを決定
  const targetCategoryId = useMemo(() => {
      // C2（小カテゴリ）のvalueにはIDが入っているので、数値化して返す
      if (selectedC2 !== "all") return Number(selectedC2);

      // C0, C1のvalueは「名前（文字列）」なので、IDとしては送らない（undefined）
      // ※バックエンドが親カテゴリ名での検索に対応していないため
      return undefined;
  }, [selectedC2]);

  const { data: items, isLoading } = useItems({ 
      sortBy: activeTab,
      categoryId: targetCategoryId 
  });

  // --- 3. カテゴリー連動リストの生成 ---
  
  // --- 1. 大カテゴリ (c0) ---
  const c0List = useMemo(() => {
      if (!categories) return [];
      
      // 日本語名(label)をキーにして重複排除する
      const map = new Map();
      
      categories.forEach(c => {
          const label = c.c0_name_jp;
          const value = c.c0_name;

          // すでに同じ日本語名のカテゴリがある場合
          if (map.has(label)) {
              // 現状の登録が "Others" で、今見ているのが "Other" なら、"Other" に乗り換える
              // (きれいな方の英語名を優先する処理)
              if (map.get(label).value === "Others" && value === "Other") {
                  map.set(label, { value: value, label: label });
              }
              return; // 重複なのでスキップ
          }

          // 新規登録
          map.set(label, { value: value, label: label });
      });
      
      return Array.from(map.values());
  }, [categories]);

  const c1List = useMemo(() => {
      if (!categories || selectedC0 === "all") return [];
      const map = new Map();
      categories
        // ▼ 念のためここも c0 の一致を確認（現状でも動くが堅牢にする）
        .filter(c => c.c0_name === selectedC0)
        .forEach(c => {
           const label = c.c1_name_jp;
           const value = c.c1_name;
           if (map.has(label)) return;
           map.set(label, { value: value, label: label });
        });
      return Array.from(map.values());
  }, [categories, selectedC0]);

  // --- 3. 小カテゴリ (c2) ---
  const c2List = useMemo(() => {
      if (!categories || selectedC1 === "all") return [];
      
      const map = new Map();
      categories
        // ▼▼▼ 修正: c1(親)だけでなく、c0(祖父)も一致しているものだけを通す ▼▼▼
        .filter(c => c.c1_name === selectedC1 && c.c0_name === selectedC0) 
        // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
        .forEach(c => {
            const label = c.c2_name_jp;
            const id = String(c.id);

            if (map.has(label)) return;
            map.set(label, { value: id, label: label });
        });

      return Array.from(map.values());
  }, [categories, selectedC1, selectedC0]); // 依存配列に selectedC0 を追加


  // --- ハンドラー ---
  const handleC0Change = (val: string) => {
      setSelectedC0(val);
      setSelectedC1("all"); // 子をリセット
      setSelectedC2("all"); // 孫をリセット
  };

  const handleC1Change = (val: string) => {
      setSelectedC1(val);
      setSelectedC2("all"); // 子をリセット
  };

  if (isLoading) return <FullPageLoader />;

  return (
    <div className="container px-4 py-8 md:px-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">商品一覧</h1>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col gap-4 mb-6">
              
              {/* ソートタブ */}
              <TabsList className="w-full sm:w-auto justify-start overflow-x-auto">
                <TabsTrigger value="recommended">おすすめ</TabsTrigger> 
                <TabsTrigger value="new">新着</TabsTrigger>
                <TabsTrigger value="popular">人気</TabsTrigger>
                <TabsTrigger value="cheap">価格が安い順</TabsTrigger>
              </TabsList>
              
              {/* カテゴリー連動プルダウン */}
              <div className="flex flex-col sm:flex-row gap-2">
                  {/* 大カテゴリ */}
                  <Select value={selectedC0} onValueChange={handleC0Change}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue placeholder="大カテゴリー" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">指定なし</SelectItem>
                      {c0List.map(c => (
                          <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* 中カテゴリ (親選択時のみ有効) */}
                  <Select value={selectedC1} onValueChange={handleC1Change} disabled={selectedC0 === "all"}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue placeholder="中カテゴリー" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">指定なし</SelectItem>
                      {c1List.map(c => (
                          <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* 小カテゴリ (親選択時のみ有効) */}
                  <Select value={selectedC2} onValueChange={setSelectedC2} disabled={selectedC1 === "all"}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue placeholder="小カテゴリー" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">指定なし</SelectItem>
                      {c2List.map(c => (
                          <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
              </div>
            </div>

            {/* リスト表示 */}
            <TabsContent value={activeTab} className="mt-0">
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
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="flex justify-center mt-8">
          <Button variant="outline" size="lg">もっと見る</Button>
        </div>
      </div>
    </div>
  );
}