import { Link, useParams, useNavigate } from "react-router-dom";
import { useOrder, useOrderPartner } from "../hooks/useOrderDetail";
import { useAuth } from "../contexts/Auth";

// v0/Shadcn UI
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Package, CreditCard, MessageCircle, Star } from "lucide-react";
import { FullPageLoader } from "../components/ui/full-page-loader";

export function OrderDetail() {
  const { id: orderId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { user: currentUser } = useAuth();
  const { data: order, isLoading: isLoadingOrder } = useOrder(orderId);
  const { 
    data: partner, 
    isLoading: isLoadingPartner, 
    isError: isPartnerError 
  } = useOrderPartner(order, currentUser?.id);

  if (isLoadingOrder || (isLoadingPartner && order)) return <FullPageLoader />;
  if (!order) return <div>取引が見つかりません。</div>;

  const total = order.item.price;
  const isPurchase = order.buyer_id === currentUser?.id;

  return (
    <div className="container max-w-3xl px-4 py-8 md:px-6">
      <div className="space-y-6">
        {/* Order Status */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>取引詳細</CardTitle>
              <Badge
                variant={order.status === "completed" ? "secondary" : "default"}
              >
                {order.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Package className="h-4 w-4" />
                商品情報
              </h3>
              <Link
                to={`/items/${order.item.id}`}
                className="flex gap-4 hover:opacity-80 transition-opacity"
              >
                <img
                  src={order.item.images[0]?.image_url || "/placeholder.svg"}
                  alt={order.item.name}
                  className="w-24 h-24 rounded-md object-cover border"
                />
                <div className="flex-1">
                  <h4 className="font-medium mb-2">
                    {order.item.name}
                    {order.item.is_deleted && (
                      <span className="text-red-500 text-sm ml-2">
                        (削除済み商品)
                      </span>
                    )}
                  </h4>
                  <p className="text-lg font-bold text-primary">
                    ¥{order.item.price.toLocaleString()}
                  </p>
                </div>
              </Link>
            </div>

            <Separator />

            {/* Payment */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                支払い情報
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">商品代金</span>
                  <span>¥{order.item.price.toLocaleString()}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-lg font-bold">
                  <span>合計</span>
                  <span className="text-primary">
                    ¥{total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle>{isPurchase ? "出品者情報" : "購入者情報"}</CardTitle>
          </CardHeader>
          <CardContent>
            {/* ▼ 修正: パートナー表示ロジック */}
            {partner ? (
              <Link
                to={`/users/${partner.id}`}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity mb-4"
              >
                <Avatar className="h-12 w-12 border">
                  <AvatarImage 
                    src={partner.icon_url || "/placeholder.svg"} 
                    className="object-cover"
                  />
                  <AvatarFallback>
                    {(partner.username || partner.email)[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold">
                    {partner.username || partner.email}
                  </p>
                </div>
              </Link>
            ) : isPartnerError ? (
              /* 退会済みユーザーの場合 */
              <div className="flex items-center gap-3 mb-4 opacity-60">
                 <Avatar className="h-12 w-12 border">
                   <AvatarFallback>?</AvatarFallback>
                 </Avatar>
                 <div className="flex-1">
                   <p className="font-semibold text-muted-foreground">退会済みユーザー</p>
                 </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mb-4">読み込み中...</p>
            )}

            {/* 相手が存在する場合のみメッセージボタンを表示 */}
            <Button 
              variant="outline" 
              className="w-full bg-transparent" 
              disabled={!partner}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              メッセージを送る
            </Button>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        {order.status === "shipped" && isPurchase && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <p className="text-sm mb-4 text-center">
                商品が届きましたら、受取評価をお願いします
              </p>
              <Button className="w-full">
                <Star className="h-4 w-4 mr-2" />
                受取評価をする
              </Button>
            </CardContent>
          </Card>
        )}

        <Button
          variant="outline"
          className="w-full bg-transparent"
          onClick={() => navigate("/users/me")}
        >
          マイページに戻る
        </Button>
      </div>
    </div>
  );
}