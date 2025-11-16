import { useParams, useNavigate } from "react-router-dom";
import { useItem } from "../hooks/useItemDetail";
import { usePurchase } from "../hooks/usePurchase";

// v0/Shadcn UI
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { ShoppingBag } from "lucide-react";
import { FullPageLoader } from "../components/ui/full-page-loader";

export function Purchase() {
  const { id: itemId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 1.
  const { data: item, isLoading } = useItem(itemId!);

  // 2.
  const { purchase, isPurchasing } = usePurchase();

  const handlePurchase = () => {
    if (!itemId) return;
    purchase(itemId);
  };

  // 3.
  const total = item?.price || 0;

  if (isLoading) return <FullPageLoader />;
  if (!item) return <div>商品が見つかりません。</div>;

  return (
    <div className="container max-w-2xl px-4 py-8 md:px-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">購入内容の確認</CardTitle>
          </div>
          <CardDescription>
            以下の内容で購入します。よろしければ「購入を確定する」ボタンを押してください。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">購入商品</h3>
            <div className="flex gap-4">
              <img
                src={item.images[0]?.image_url || "/placeholder.svg"}
                alt={item.name}
                className="w-24 h-24 rounded-md object-cover border"
              />
              <div className="flex-1">
                <h4 className="font-medium mb-2">{item.name}</h4>
                <p className="text-lg font-bold text-primary">
                  ¥{item.price.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/*<div>
<h3 className="font-semibold mb-3">配送先</h3>
      
     </div>

     <Separator />
            */}
          {/*      <div>
      <h3 className="font-semibold mb-3">支払い方法</h3>
      
     </div>
     <Separator />
            */}

          <div>
            <h3 className="font-semibold mb-3">お支払い金額</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">商品代金</span>
                <span>¥{item.price.toLocaleString()}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between text-lg font-bold">
                <span>合計</span>
                <span className="text-primary">¥{total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-4">
              <p className="text-sm text-blue-900 leading-relaxed">
                購入を確定すると、出品者に代金が支払われます。
                商品が届いたら、受取評価をお願いします。
              </p>
            </CardContent>
          </Card>

          <div className="flex gap-4 pt-4">
            <Button
              onClick={handlePurchase}
              size="lg"
              className="flex-1"
              disabled={isPurchasing}
            >
              {isPurchasing ? "処理中..." : "購入を確定する"}
            </Button>
            <Button variant="outline" onClick={() => navigate(-1)} size="lg">
              キャンセル
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
