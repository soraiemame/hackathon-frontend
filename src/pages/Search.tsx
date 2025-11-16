import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useItemSearch } from "../hooks/useItemSearch";

// v0/Shadcn UI
import { ItemCard } from "../components/item-card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Slider } from "../components/ui/slider";
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
import { Search as SearchIcon, SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const query = searchParams.get("q") || "";

  const { data: items, isLoading } = useItemSearch(query);

  const [priceRange, setPriceRange] = useState([0, 100000]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: searchTerm });
  };

  // 4.
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
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </form>
        </div>

        <div className="flex gap-6">
          {/* Desktop Filters */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <Card>
              <CardHeader>
                <CardTitle>絞り込み</CardTitle>
              </CardHeader>
              <CardContent>
                <FilterContent
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                />
              </CardContent>
            </Card>
          </aside>

          {/* Results */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <p className="text-muted-foreground">
                {query && (
                  <>
                    <span className="font-semibold text-foreground">
                      {items?.length || 0}
                    </span>
                    件の商品が見つかりました
                  </>
                )}
              </p>
              <Select defaultValue="recommended">
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">おすすめ順</SelectItem>
                  <SelectItem value="new">新着順</SelectItem>
                  <SelectItem value="price-low">価格が安い順</SelectItem>
                  <SelectItem value="price-high">価格が高い順</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading && <div>検索中...</div>}

            {!isLoading && query && items?.length === 0 && (
              <div>「{query}」に一致する商品はありませんでした。</div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
          </div>
        </div>
      </div>
    </div>
  );
}

//
//
function FilterContent({
  priceRange,
  setPriceRange,
}: {
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>カテゴリー</Label>
        <Select defaultValue="all">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            Click to copy
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label>価格</Label>
        <div className="space-y-4">
          <Slider
            min={0}
            max={100000}
            step={1000}
            value={priceRange}
            onValueChange={setPriceRange}
            className="py-4"
          />
          <div className="flex items-center gap-2 text-sm">
            <Input
              type="number"
              value={priceRange[0]}
              onChange={(e) =>
                setPriceRange([Number(e.target.value), priceRange[1]])
              }
              className="h-8"
            />
            <span className="text-muted-foreground">〜</span>
            <Input
              type="number"
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([priceRange[0], Number(e.target.value)])
              }
              className="h-8"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
