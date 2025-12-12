import { Link } from "react-router-dom";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

interface ItemCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  condition?: string;
  isSold?: boolean;
}

export function ItemCard({
  id,
  name,
  price,
  image,
  condition,
  isSold,
}: ItemCardProps) {
  return (
    <Link to={`/items/${id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {/* 画像 */}
          <img
            src={image || "/placeholder.svg"}
            alt={name}
            // 売り切れ時は少しグレーアウトさせる
            className={`object-cover w-full h-full group-hover:scale-105 transition-transform duration-300 ${isSold ? 'opacity-80 grayscale-[30%]' : ''}`}
          />

          {/* ▼ 修正: 赤いSOLDバナー（位置調整済み） */}
          {isSold && (
            // w-28 h-28 で表示領域を確保し、overflow-hiddenで角を作る
            <div className="absolute top-0 left-0 w-28 h-28 overflow-hidden z-10 pointer-events-none">
              {/* 帯の部分: top/left/width で位置と長さを調整 */}
              <div className="absolute top-4 -left-10 w-40 bg-red-600 -rotate-45 flex items-center justify-center py-1 shadow-md">
                <span className="text-white font-bold text-sm tracking-widest drop-shadow-md">
                  SOLD
                </span>
              </div>
            </div>
          )}

          {/* 商品の状態（売り切れでない場合のみ表示） */}
          {condition && !isSold && (
            <Badge className="absolute top-2 left-2 bg-primary/90 shadow-sm z-10">
              {condition}
            </Badge>
          )}
        </div>
        <CardContent className="p-3">
          <h3 className={`font-medium text-sm line-clamp-2 mb-2 min-h-[2.5rem] ${isSold ? 'text-muted-foreground' : ''}`}>
            {name}
          </h3>
          <p className={`text-lg font-bold ${isSold ? 'text-muted-foreground' : 'text-primary'}`}>
            ¥{price.toLocaleString()}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}