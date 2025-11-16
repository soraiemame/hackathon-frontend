import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/Auth";
import type { User } from "../types/user";
import type { Order } from "../types/order";
import type { Item } from "../types/item";
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
import { Settings, LogOut } from "lucide-react";

interface ProfileTabsProps {
  user: User | undefined;
  orders: Order[] | undefined;
  listings: Item[] | undefined;
}

export function ProfileTabs({ user, orders, listings }: ProfileTabsProps) {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    navigate("/");
  };

  return (
    <Tabs defaultValue="listings" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3 max-w-md">
        <TabsTrigger value="listings">出品中</TabsTrigger>
        <TabsTrigger value="orders">取引履歴</TabsTrigger>
        <TabsTrigger value="settings">設定</TabsTrigger>
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
          {/* ここのonclickの編集 */}
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">アカウント設定</h3>
                    <p className="text-sm text-muted-foreground">
                      プロフィール情報の編集（上部のボタンから）
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

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
        </div>
      </TabsContent>
    </Tabs>
  );
}
