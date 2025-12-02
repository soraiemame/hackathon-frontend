import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/Auth";

// Logic Hooks
import {
  useItem,
  useItemComments,
  useItemSeller,
  useCurrentUser,
} from "../hooks/useItemDetail";
import { useItemLike } from "../hooks/useLike";

// UI Components
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Separator } from "../components/ui/separator";
import { Textarea } from "../components/ui/textarea";
import {
  Heart,
  MessageCircle,
  Share2,
  Flag,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { FullPageLoader } from "../components/ui/full-page-loader";

export function ItemDetail() {
  const { id: itemId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!itemId) return <div>商品IDが指定されていません。</div>;

  const { isLoggedIn } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [commentBody, setCommentBody] = useState("");

  // Hooks
  const { likeCount, isLiked, toggleLike, isLikeProcessing } = useItemLike(itemId);

  const {
    data: item,
    isLoading: isLoadingItem,
    isError: isErrorItem,
  } = useItem(itemId);

  const {
    commentsQuery,
    postComment,
    isPostingComment,
    deleteComment,
    isDeletingComment,
  } = useItemComments(itemId);

  const { data: currentUser } = useCurrentUser();
  const { 
    data: seller, 
    isLoading: isLoadingSeller, 
    isError: isSellerError 
  } = useItemSeller(item);

  const conditionNames = [
    "新品・未使用",
    "未使用に近い",
    "目立った傷や汚れなし",
    "やや傷や汚れあり",
    "全体的に状態が悪い",
  ];

  // Handlers
  const handleLikeClick = () => {
    if (!isLoggedIn) {
      if (window.confirm("いいねをするにはログインが必要です。ログインページに移動しますか？")) {
        navigate("/login");
      }
      return;
    }
    toggleLike();
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentBody.trim()) return;

    postComment(
      { itemId, data: { body: commentBody } },
      {
        onSuccess: () => setCommentBody(""),
      }
    );
  };

  const handleDeleteComment = (commentId: number) => {
    if (window.confirm("本当にこのコメントを削除しますか？")) {
      deleteComment({ itemId, commentId });
    }
  };

  const handlePreviousImage = () => {
    if (!item || item.images.length === 0) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? item!.images.length - 1 : prev - 1
    );
  };
  const handleNextImage = () => {
    if (!item || item.images.length === 0) return;
    setCurrentImageIndex((prev) =>
      prev === item!.images.length - 1 ? 0 : prev + 1
    );
  };

  const isOwner = isLoggedIn && currentUser?.id === item?.seller_id;

  if (isLoadingItem || commentsQuery.isLoading || (isLoadingSeller && item)) {
    return <FullPageLoader />;
  }

  if (isErrorItem || !item) {
    return <div>商品が見つかりません。</div>;
  }

  return (
    <div className="container px-4 py-8 md:px-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <div className="relative aspect-square bg-muted">
              <img
                src={
                  item.images[currentImageIndex]?.image_url ||
                  "/placeholder.svg"
                }
                alt={item.name}
                className="object-cover w-full h-full"
              />
              {item.images.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2"
                    onClick={handlePreviousImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={handleNextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {item.images.map((_, index) => (
                      <button
                        key={index}
                        className={`h-2 w-2 rounded-full transition-all ${
                          index === currentImageIndex
                            ? "bg-white w-6"
                            : "bg-white/50"
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2 p-2">
              {item.images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`aspect-square rounded-md overflow-hidden border-2 transition-all ${
                    index === currentImageIndex
                      ? "border-primary"
                      : "border-transparent hover:border-border"
                  }`}
                >
                  <img
                    src={image.image_url || "/placeholder.svg"}
                    alt={`${item.name} - ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          </Card>

          <Card className="mt-6">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">商品説明</h2>
              <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card className="mt-6">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">
                コメント ({commentsQuery.data?.length || 0})
              </h2>

              <div className="space-y-4 mb-6">
      {commentsQuery.data?.map((comment) => {
        // ▼ 修正: ユーザーの状態を判定するロジック
        const commentUser = comment.user;
        // ユーザーデータが無い、または is_deleted フラグが立っている場合は「退会済み」扱い
        const isDeletedUser = !commentUser;
        
        const displayName = isDeletedUser 
            ? "退会済みユーザー" 
            : (commentUser.username || `User ${comment.user_id}`);
            
        const avatarSrc = isDeletedUser 
            ? "/placeholder.svg" // 退会済み用の画像があればそれに変更
            : (commentUser.icon_url || "/placeholder.svg");

        return (
          <div key={comment.id} className="flex gap-3">
            <Avatar className="h-10 w-10 border">
              <AvatarImage 
                src={avatarSrc} 
                className="object-cover"
              />
              <AvatarFallback>
                 {/* 退会済みの場合は "?"、そうでなければ頭文字 */}
                 {isDeletedUser ? "?" : displayName[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`font-semibold text-sm ${isDeletedUser ? "text-muted-foreground/70" : ""}`}>
                  {displayName}
                </span>
                <span className="text-xs text-muted-foreground">
                  {comment.created_at}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {comment.body}
              </p>
            </div>
            
            {/* 削除ボタン: ログイン中 かつ 自分のコメント かつ ユーザーが存在する場合のみ表示 */}
            {isLoggedIn && currentUser?.id === comment.user_id && !isDeletedUser && (
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => handleDeleteComment(comment.id)}
                disabled={isDeletingComment}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        );
      })}
    </div>
              
              <Separator className="my-4" />
              
              {isLoggedIn ? (
                <form onSubmit={handleSubmitComment} className="space-y-3">
                  <Textarea
                    placeholder="コメントを入力..."
                    value={commentBody}
                    onChange={(e) => setCommentBody(e.target.value)}
                    rows={3}
                    required
                  />
                  <Button
                    className="w-full"
                    type="submit"
                    disabled={isPostingComment}
                  >
                    {isPostingComment ? "投稿中..." : "コメントを送信"}
                  </Button>
                </form>
              ) : (
                <p className="text-center text-sm text-muted-foreground">
                  <Link to="/login" className="text-primary hover:underline">
                    ログイン
                  </Link>
                  してコメントする
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Purchase Info */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h1 className="text-2xl font-bold mb-2">{item.name}</h1>
                  <p className="text-3xl font-bold text-primary">
                    ¥{item.price.toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {/* いいね */}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-0 hover:bg-transparent text-muted-foreground"
                    onClick={handleLikeClick}
                    disabled={isLikeProcessing}
                  >
                    <Heart className={`h-5 w-5 mr-1 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                    <span>{likeCount}</span>
                  </Button>
                  
                  <span className="mx-2">|</span>

                  <MessageCircle className="h-4 w-4 mr-1" />
                  <span>{commentsQuery.data?.length || 0}</span>
                </div>

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">商品の状態</span>
                    <Badge variant="secondary">
                      {item.condition ? conditionNames[item.condition - 1] : "未設定"}
                    </Badge>
                  </div>
                </div>

                <Separator />

                {isOwner ? (
                  <div className="space-y-2">
                    <Button className="w-full" asChild>
                      <Link to={`/items/${item.id}/edit`}>商品を編集</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button className="w-full" size="lg" asChild disabled={!item.selling}>
                      <Link to={item.selling ? `/items/${item.id}/purchase` : "#"}>
                        {item.selling ? "購入する" : "売り切れ"}
                      </Link>
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleLikeClick}
                        disabled={isLikeProcessing}
                        className={isLiked ? "text-red-600 border-red-200 bg-red-50" : ""}
                      >
                        <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
                        {isLiked ? "いいね済み" : "いいね"}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-1" />
                        シェア
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Seller Info */}
            <Card>
              <CardContent className="pt-6">
                {/* ▼ 修正: 出品者情報の表示ロジック */}
                {seller ? (
                  <Link
                    to={`/users/${seller.id}`}
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                  >
                    <Avatar className="h-12 w-12 border">
                      <AvatarImage src={seller.icon_url || "/placeholder.svg"} className="object-cover" />
                      <AvatarFallback>
                        {(seller.username || seller.email)[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold">
                        {seller.username || seller.email}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{seller.created_at} から利用</span>
                      </div>
                    </div>
                  </Link>
                ) : isSellerError ? (
                  /* 退会済みユーザーの場合 */
                  <div className="flex items-center gap-3 opacity-60">
                     <Avatar className="h-12 w-12 border">
                       <AvatarFallback>?</AvatarFallback>
                     </Avatar>
                     <div className="flex-1">
                       <p className="font-semibold text-muted-foreground">退会済みユーザー</p>
                     </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">読み込み中...</p>
                )}

                {/* 出品者が存在する場合のみボタンを表示 */}
                <Button
                  variant="outline"
                  className="w-full mt-4 bg-transparent"
                  disabled={!seller}
                  asChild={!!seller} // sellerがいる時だけasChild (Linkとして振る舞う)
                >
                  {seller ? (
                    <Link to={`/users/${seller.id}`}>
                      出品者のページを見る
                    </Link>
                  ) : (
                    <span>出品者のページを見る</span>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Button
              variant="ghost"
              className="w-full text-muted-foreground"
              size="sm"
            >
              <Flag className="h-4 w-4 mr-2" />
              この商品を報告
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}