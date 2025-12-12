import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/Auth";
import type { User } from "../types/user";
import type { Order } from "../types/order";
import type { Item } from "../types/item";
import { useMyLikes } from "../hooks/useUserProfile";

import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { ItemCard } from "../components/item-card";
import { Heart, LogOut, Trash2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import apiClient from "../api/client";
import { toast } from "sonner";

async function deleteAccount(): Promise<void> {
  await apiClient.delete(`/api/users/me`);
}

interface ProfileTabsProps {
  user: User | undefined;
  orders: Order[] | undefined;
  listings: Item[] | undefined;
}

export function ProfileTabs({ user, orders, listings }: ProfileTabsProps) {
  const { user: currentUser } = useAuth();
  const auth = useAuth();
  const navigate = useNavigate();
  const isOwnProfile = currentUser && user && currentUser.id === user.id;
  const { data: likes, isLoading: isLoadingLikes } = useMyLikes(!!isOwnProfile);

  const handleLogout = () => {
    auth.logout();
    navigate("/");
  };
  const deleteMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      toast.success("削除成功",{ description: "アカウントを削除しました。" });
      auth.logout();
      navigate("/");
    },
    onError: () => {
      toast.error("削除失敗",{ description: "アカウントの削除に失敗しました。" });
    },
  });
  const handleDeleteAccount = () => {
    if (!user) return;
    if (
      window.confirm(
        "本当にアカウントを削除しますか？\nこの操作は取り消せません。出品した商品もすべて削除されます。"
      )
    ) {
      deleteMutation.mutate();
    }
  };

  return (
    <Tabs defaultValue="listings" className="space-y-6">
      <TabsList className={`grid w-full max-w-xl ${isOwnProfile ? "grid-cols-4" : "grid-cols-2"}`}>
        <TabsTrigger value="listings">出品中</TabsTrigger>
        {isOwnProfile && <TabsTrigger value="likes">いいね</TabsTrigger>}
        <TabsTrigger value="orders">取引履歴</TabsTrigger>
        {isOwnProfile && <TabsTrigger value="settings">設定</TabsTrigger>}
      </TabsList>

      {/* Listings Tab */}
      <TabsContent value="listings" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">出品中の商品</h2>
          <Button asChild>
            <Link to="/items/new">新しく出品</Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {listings?.map((item) => (
            <ItemCard
              key={item.id}
              id={item.id}
              name={item.name}
              price={item.price}
              image={item.images[0]?.image_url}
            />
          ))}
          {listings?.length === 0 && <p>出品中の商品はありません。</p>}
        </div>
      </TabsContent>

      {isOwnProfile && (
        <TabsContent value="likes" className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                いいねした商品
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {likes?.map((like) => (
                <ItemCard
                key={like.item.id}
                id={like.item.id}
                name={like.item.name}
                price={like.item.price}
                image={like.item.images[0]?.image_url}
                />
            ))}
            {!isLoadingLikes && likes?.length === 0 && (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                    <p>いいねした商品はまだありません。</p>
                    <Button variant="link" asChild className="mt-2">
                        <Link to="/items">商品を探す</Link>
                    </Button>
                </div>
            )}
            </div>
        </TabsContent>
      )}

      {/* Orders Tab */}
      <TabsContent value="orders" className="space-y-4">
        <h2 className="text-xl font-semibold">取引履歴</h2>
        <div className="space-y-3">
          {orders?.map((order) => (
            <Card key={order.id}>
              <CardContent className="pt-6">
                <Link
                  to={`/orders/${order.id}`}
                  className="flex gap-4 hover:opacity-80 transition-opacity"
                >
                  <img
                    src={order.item.images[0]?.image_url || "/placeholder.svg"}
                    alt={order.item.name}
                    className="w-20 h-20 rounded-md object-cover border"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-medium line-clamp-2">
                        {order.item.name}
                      </h3>
                      <Badge
                        variant={
                          order.status === "completed" ? "secondary" : "default"
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-lg font-bold text-primary mb-1">
                      ¥{order.item.price.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>
                        {user && order.buyer_id === user.id ? "購入" : "販売"}
                      </span>
                      <span>•</span>
                      <span>{order.created_at}</span>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
          {orders?.length === 0 && <p>取引履歴はありません。</p>}
        </div>
      </TabsContent>

      <TabsContent value="settings" className="space-y-4">
        <h2 className="text-xl font-semibold">設定</h2>
        <div className="space-y-3">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div
                className="flex items-center justify-between"
                onClick={handleLogout}
              >
                <div className="flex items-center gap-3">
                  <LogOut className="h-5 w-5 text-destructive" />
                  <div>
                    <h3 className="font-medium text-destructive">ログアウト</h3>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card
            className="hover:bg-red-50 transition-colors cursor-pointer border-red-200"
            onClick={handleDeleteAccount}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Trash2 className="h-5 w-5 text-destructive" />
                  <div>
                    <h3 className="font-medium text-destructive">
                      {deleteMutation.isPending ? "削除中..." : "アカウント削除"}
                    </h3>
                    <p className="text-sm text-destructive/80">
                      退会し、すべてのデータを削除します
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}
