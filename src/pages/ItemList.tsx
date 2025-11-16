import { useMemo, useState } from "react";
import { useItems } from "../hooks/useItems";
import { ItemCard } from "../components/item-card";
import { Button } from "../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { FullPageLoader } from "../components/ui/full-page-loader";

export function ItemList() {
  const { data: items, isLoading } = useItems();

  const [activeTab, setActiveTab] = useState("recommended");
  const [category, setCategory] = useState("all");

  const sortedItems = useMemo(() => {
    if (!items) return [];

    switch (activeTab) {
      case "new":
        return [...items].reverse();
      case "price-low":
        return [...items].sort((a, b) => a.price - b.price);
      case "recommended":
      default:
        return items;
    }
  }, [items, activeTab]);

  const filteredItems = useMemo(() => {
    return sortedItems;
    // !todo!
    //  if (category === 'all') {
    //      return sortedItems;
    //  }
    //  return sortedItems.filter(item => item.category === category);
  }, [sortedItems, category]);

  if (isLoading) {
    return <FullPageLoader />;
  }

  return (
    <div className="container px-4 py-8 md:px-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">商品一覧</h1>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
              <TabsList>
                <TabsTrigger value="recommended">おすすめ</TabsTrigger>
                <TabsTrigger value="new">新着</TabsTrigger>
                <TabsTrigger value="popular">人気 (未実装)</TabsTrigger>
                <TabsTrigger value="price-low">価格が安い順</TabsTrigger>
              </TabsList>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="カテゴリー" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  {/*<SelectItem value="fashion">ファッション</SelectItem>
<SelectItem value="electronics">家電</SelectItem>
*/}
                </SelectContent>
              </Select>
            </div>
            <TabsContent value={activeTab} className="mt-0">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    price={item.price}
                    image={item.images[0]?.image_url}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <div className="flex justify-center mt-8">
          <Button variant="outline" size="lg">
            もっと見る
          </Button>
        </div>
      </div>
    </div>
  );
}
