import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useItemEdit } from "../hooks/useItemEdit";

// v0/Shadcn UI
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import type { ItemCreate } from "../types/item";
import { FullPageLoader } from "../components/ui/full-page-loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
// ▼ 追加
import { CategorySelector } from "../components/category-selector";
import { toast } from "sonner";

export function ItemEdit() {
  const { id: itemId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { query, mutation } = useItemEdit(itemId);

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState("1");
  // ▼ 変更: 初期値はundefinedにしておく
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (query.data) {
      setName(query.data.name);
      setPrice(query.data.price);
      setDescription(query.data.description || "");
      // ▼ 追加: 既存のカテゴリーIDをセット
      setCategoryId(query.data.category_id);
    }
  }, [query.data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // ▼ 変更: undefined チェック
    if (!query.data || categoryId === undefined) {
        toast.error("カテゴリー不備", { description: "小カテゴリーまで選択してください。" });
        return;
    };

    const updatedData: ItemCreate = {
      name: name,
      price: price,
      category_id: categoryId, // ▼ 変更: Stateの値を使用
      description: description,
      condition: Number(condition),
      // 画像は変更しないので既存のものを送信
      image_keys: query.data.images.map((img) => img.image_key),
    };
    mutation.mutate({ itemId: itemId!, data: updatedData });
  };

  if (query.isLoading) return <FullPageLoader />;
  if (query.isError || !query.data)
    return <div>商品データが見つかりません。</div>;

  return (
    <div className="container max-w-3xl px-4 py-8 md:px-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">商品を編集</CardTitle>
          <CardDescription>商品情報を更新してください</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>商品画像（現在は編集できません） *</Label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                {query.data.images.map((image, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={image.image_url || "/placeholder.svg"}
                      alt={`商品画像 ${index + 1}`}
                      className="rounded-md object-cover w-full h-full border opacity-50"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">商品名 *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={40}
              />
              <p className="text-xs text-muted-foreground">40文字以内</p>
            </div>

            {/* ▼ 変更: CategorySelectorを使用 */}
            <div className="space-y-2">
              <Label>カテゴリー *</Label>
              {/* ▼ 修正点: 
                 1. key={categoryId} を削除（これがリセットの原因でした）
                 2. value={categoryId} を追加（これで初期値を渡します）
              */}
              <CategorySelector 
                value={categoryId} 
                onChange={setCategoryId} 
              />
              <p className="text-xs text-muted-foreground">
                変更する場合は選択し直してください
              </p>
            </div>

            {/* 以下変更なし */}
            <div className="space-y-2">
              <Label htmlFor="description">商品説明 *</Label>
              <Textarea
                id="description"
                rows={8}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                maxLength={1000}
              />
              <p className="text-xs text-muted-foreground">1000文字以内</p>
            </div>
            
            <div className="space-y-2">
              <Label>商品の状態 *</Label>
              <Select value={condition} onValueChange={setCondition} required>
                <SelectTrigger>
                  <SelectValue placeholder="状態を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">新品・未使用</SelectItem>
                  <SelectItem value="2">未使用に近い</SelectItem>
                  <SelectItem value="3">目立った傷や汚れなし</SelectItem>
                  <SelectItem value="4">やや傷や汚れあり</SelectItem>
                  <SelectItem value="5">全体的に状態が悪い</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">価格</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  ¥
                </span>
                <Input
                  id="price"
                  type="number"
                  className="pl-8"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  required
                  min={300}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                販売手数料10%が差し引かれます
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                className="flex-1"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "保存中..." : "変更を保存"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                キャンセル
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}