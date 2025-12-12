// src/pages/ItemCreate.tsx

import { useState, useRef } from "react";
import type { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateItem } from "../hooks/useCreateItem"; //
import { useSuggestCategory } from "../hooks/useSuggestCategory";
import { useSuggestPrice } from "../hooks/useSuggestPrice";

// v0/Shadcn UI
import { Button } from "../components/ui/button";
import { toast } from "sonner";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { X, Upload, Sparkles } from "lucide-react";
import { CategorySelector } from "../components/category-selector";

export function ItemCreate() {
  const navigate = useNavigate();

  // 1.
  const [name, setName] = useState("");
  const [price, setPrice] = useState(300);
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState("1");
  const [files, setFiles] = useState<File[]>([]);
  const [categoryId, setCategoryId] = useState<number>();
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 2.
  const { createItem, isLoading } = useCreateItem();
  const { mutateAsync: suggest, isPending: isSuggesting } =
    useSuggestCategory();
  const { mutateAsync: suggestPrice, isPending: isPriceSuggesting } =
    useSuggestPrice();

  // --- ハンドラー: AIカテゴリー提案 ---
  const handleSuggestCategory = async () => {
    // フロントエンド側での必須チェック
    if (!name || !description || files.length === 0) {
      toast.error("入力エラー", {
        description:
          "AI提案を使用するには、商品名・商品説明・画像を少なくとも1枚設定してください。",
      });
      return;
    }

    // 1枚目の画像を取得
    const mainImage = files[0];

    try {
      // APIコール
      // useMutationの場合、引数はオブジェクトで渡す形に定義したので、ここも合わせます
      const suggestedId = await suggest({
        title: name,
        description: description,
        image: mainImage,
      });

      if (suggestedId) {
        console.log(suggestedId);
        toast.success("AI提案完了", {
          description: "カテゴリーが自動選択されました。",
        });
        setCategoryId(suggestedId);
      }
    } catch (error) {
      // useMutationのエラーハンドリングはここ、またはonErrorコールバックで行えます
      console.error("AI提案エラー:", error);
      toast.error("提案失敗", {
        description: "カテゴリーの提案に失敗しました。",
      });
    }
  };

  const handleSuggestPrice = async () => {
    if (!name || !description || files.length === 0) {
      toast.error("入力エラー", {
        description:
          "AI提案を使用するには、商品名・商品説明・画像を少なくとも1枚設定してください。",
      });
      return;
    }

    const mainImage = files[0];

    try {
      const result = await suggestPrice({
        title: name,
        description: description,
        condition: Number(condition),
        image: mainImage,
      });

      if (result && result.suggested_price) {
        setPrice(result.suggested_price);

        // 成功時に「理由」も一緒に表示してあげると親切です
        toast.success("価格提案完了", {
          description: `推定価格: ¥${result.suggested_price.toLocaleString()}`,
        });
      }
    } catch (error) {
      console.error("AI価格提案エラー:", error);
      toast.error("提案失敗", {
        description: "価格の提案に失敗しました。",
      });
    }
  };

  //
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const totalFiles = files.length + newFiles.length;

      if (totalFiles > 10) {
        toast.error("枚数制限", { description: "画像は最大10枚までです。" });
        return;
      }

      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setFiles((prev) => [...prev, ...newFiles]);
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (indexToRemove: number) => {
    URL.revokeObjectURL(imagePreviews[indexToRemove]);
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
    setImagePreviews((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      toast.error("画像不足", {
        description: "画像を1枚以上選択してください。",
      });
      return;
    }
    if (!categoryId) {
      toast.error("カテゴリー不備", {
        description: "小カテゴリーまで選択してください。",
      });
      return;
    }

    // 3.
    createItem({
      name,
      price,
      category_id: categoryId,
      description,
      condition: Number(condition),
      files,
    });
  };

  // 4.
  return (
    <div className="container max-w-3xl px-4 py-8 md:px-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">商品を出品</CardTitle>
          <CardDescription>商品情報を入力して出品してください</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>商品画像（最大10枚）*</Label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                {imagePreviews.map((image, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={image}
                      alt={`商品画像 ${index + 1}`}
                      className="rounded-md object-cover w-full h-full border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    {index === 0 && (
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                          メイン
                        </span>
                      </div>
                    )}
                  </div>
                ))}
                {files.length < 10 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-md border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors flex items-center justify-center"
                  >
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  </button>
                )}
              </div>
              <Input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                accept="image/*"
                className="hidden"
              />
              <p className="text-xs text-muted-foreground">
                最初の画像がメイン画像になります
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">商品名 *</Label>
              <Input
                id="title"
                placeholder="例：ほぼ新品 MacBook Pro 13インチ"
                required
                maxLength={40}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">40文字以内</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">商品説明 *</Label>
              <Textarea
                id="description"
                rows={8}
                placeholder="商品の状態や付属品など、詳しく説明してください"
                required
                maxLength={1000}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">1000文字以内</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>カテゴリー *</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleSuggestCategory}
                  // 画像、名前、説明のいずれかが欠けている、または通信中は無効化
                  disabled={
                    isSuggesting || !name || !description || files.length === 0
                  }
                  className="text-primary hover:text-primary/80 h-8"
                >
                  {isSuggesting ? (
                    "解析中..."
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      AIで提案
                    </>
                  )}
                </Button>
              </div>
              <CategorySelector value={categoryId} onChange={setCategoryId} />
              <p className="text-xs text-muted-foreground">
                大・中・小カテゴリーを順に選択してください
              </p>
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
              <div className="flex items-center justify-between">
                <Label htmlFor="price">価格 *</Label>
                {/* ▼ 価格提案ボタンの追加 */}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleSuggestPrice}
                  disabled={
                    isPriceSuggesting ||
                    !name ||
                    !description ||
                    files.length === 0
                  }
                  className="text-primary hover:text-primary/80 h-8"
                >
                  {isPriceSuggesting ? (
                    "解析中..."
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      相場を調べる
                    </>
                  )}
                </Button>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  ¥
                </span>
                <Input
                  id="price"
                  type="number"
                  className="pl-8"
                  placeholder="300"
                  required
                  min={300}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                販売手数料10%が差し引かれます（最低価格: ¥300）
              </p>
            </div>
            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? "出品中..." : "出品する"}
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
