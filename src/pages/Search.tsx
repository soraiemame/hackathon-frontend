import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
// import { useItemSearch } from "../hooks/useItemSearch";

import { ItemCard } from "../components/item-card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
// import { Slider } from "../components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Loader2, Search as SearchIcon, SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import { CategorySelector } from "../components/category-selector";
import { useItems } from "../hooks/useItems";

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  
  // ローカルステート
  const [searchTerm, setSearchTerm] = useState(query);
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState("new");
  
  // 価格による絞り込みはAPI未整備のため一時的に無効化
  // const [priceRange, setPriceRange] = useState([0, 100000]);

  // URLのクエリが変わったら検索ボックスも同期
  useEffect(() => {
    setSearchTerm(query);
  }, [query]);

  // ▼ データ取得
  const { data: items, isLoading } = useItems({
    search: query,
    categoryId: categoryId,
    sortBy: sortBy,
    // minPrice: priceRange[0], // TODO: API実装後に有効化
    // maxPrice: priceRange[1],
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // URLを更新して検索実行
    setSearchParams({ q: searchTerm });
  };

  return (
    <div className="container px-4 py-8 md:px-6">
      <div className="flex flex-col gap-6">
        
        {/* Search Header */}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">商品を検索</h1>

          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="キーワードを入力"
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button type="submit">検索</Button>

            {/* Mobile Filter Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="lg:hidden bg-transparent"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="sr-only">フィルター</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>絞り込み</SheetTitle>
                  <SheetDescription>
                    検索条件を設定してください
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent
                    setCategoryId={setCategoryId}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </form>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Filters (Sidebar) */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>絞り込み</CardTitle>
              </CardHeader>
              <CardContent>
                <FilterContent
                  setCategoryId={setCategoryId}
                />
              </CardContent>
            </Card>
          </aside>

          {/* Results Area */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <p className="text-muted-foreground text-sm">
                {query ? `「${query}」の検索結果` : "すべての商品"}
                {!isLoading && (
                  <>
                    <span className="mx-2">|</span>
                    <span className="font-semibold text-foreground">
                      {items?.length || 0}
                    </span>
                    件
                  </>
                )}
              </p>
              
              {/* Sort Selector */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">新着順</SelectItem>
                  <SelectItem value="popular">人気順</SelectItem>
                  <SelectItem value="price-low">価格が安い順</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Loading State */}
            {isLoading ? (
               <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
               </div>
            ) : (
                <>
                    {/* No Results */}
                    {items?.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg">
                            <p className="text-lg font-medium">該当する商品が見つかりませんでした。</p>
                            <p className="text-sm mt-2">検索条件を変えて再度お試しください。</p>
                        </div>
                    )}

                    {/* Item Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                        {items?.map((item) => (
                            <ItemCard
                            key={item.id}
                            id={item.id}
                            name={item.name}
                            price={item.price}
                            image={item.images[0]?.image_url}
                            />
                        ))}
                    </div>
                </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// Sub Component: Filter Content
// ------------------------------------------------------------------
function FilterContent({
  setCategoryId,
}: {
  setCategoryId: (id: number | undefined) => void;
}) {
  return (
    <div className="space-y-6">
      
      {/* カテゴリーセレクター */}
      <div className="space-y-2">
        <Label>カテゴリー</Label>
        {/* CategorySelector を縦積み (flex-col) で表示 */}
        <CategorySelector onChange={setCategoryId} className="flex-col" />
      </div>

      {/* TODO: 価格絞り込み機能の実装 */}
      {/* <div className="space-y-3 opacity-50 pointer-events-none">
        <Label>価格 (開発中)</Label>
         ... Slider Components ...
      </div> 
      */}
    </div>
  );
}