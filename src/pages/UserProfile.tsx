import { useParams } from "react-router-dom";
import { useUser, useUserItems } from "../hooks/useUserProfile";

// v0/Shadcn UI
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { ItemCard } from "../components/item-card";
import { ShoppingBag } from "lucide-react";
import { FullPageLoader } from "../components/ui/full-page-loader";

export function UserProfile() {
  const { id: userId } = useParams<{ id: string }>();

  const { data: user, isLoading: isLoadingUser } = useUser(userId);
  const { data: items, isLoading: isLoadingItems } = useUserItems(userId);

  if (isLoadingUser || isLoadingItems) return <FullPageLoader />;
  if (!user) return <div>ユーザーが見つかりません。</div>;

  return (
    <div className="container px-4 py-8 md:px-6">
      {/* Profile Header */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <Avatar className="h-24 w-24 border">
              {/* ▼ 修正: user.icon_url を使用 */}
              <AvatarImage 
                src={user.icon_url || "/placeholder.svg"} 
                className="object-cover"
              />
              <AvatarFallback>
                {(user.username || user.email)[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">
                {user.username || user.email}
              </h1>
              <p className="text-muted-foreground text-sm mb-3">
                @{user.username || "..."}
              </p>

              <div className="flex flex-wrap gap-4 text-sm mb-4">
                <div className="flex items-center gap-1">
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                  <span>{items?.length || 0}件の販売</span>
                </div>
                <div className="text-muted-foreground">
                  {user.created_at}から利用
                </div>
              </div>
              <Button variant="outline">フォロー</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">出品中の商品</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {items?.map((item) => (
            <ItemCard
              key={item.id}
              id={item.id}
              name={item.name}
              price={item.price}
              // ▼ 修正: プロパティ名を統一 (image -> imageUrl)
              image={item.images[0]?.image_url}
            />
          ))}
          {items?.length === 0 && <p>出品した商品はありません。</p>}
        </div>
      </div>
    </div>
  );
}