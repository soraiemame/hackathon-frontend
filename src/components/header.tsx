"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, User, Plus, List } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useAuth } from "../contexts/Auth";

export function Header() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");

  // 検索処理を実行する関数
  const handleSearch = () => {
    // 空文字またはスペースのみの場合は実行しない
    if (!keyword.trim()) return;

    // 検索ページへ遷移 (例: /search?keyword=入力値)
    // ※アプリのルーティング設計に合わせてパスは調整してください
    navigate(`/items/search?q=${encodeURIComponent(keyword)}`);
  };

  // エンターキーが押された時の処理
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4 px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <ShoppingBag className="h-6 w-6 text-primary" />
          <span className="text-pretty">フリマ</span>
        </Link>

        <div className="flex flex-1 items-center gap-4 md:gap-6 max-w-xl">
          <div className="relative flex-1">
            {/* アイコンをクリック可能なボタンに変更 */}
            <button
              onClick={handleSearch}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              type="button"
            >
              <Search className="h-4 w-4" />
            </button>
            <Input
              type="search"
              placeholder="商品を検索"
              className="pl-9 bg-muted/50"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>

        <nav className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="hidden sm:inline-flex"
          >
            <Link to="/items">
              <List className="h-5 w-5" />
              <span className="sr-only">商品一覧</span>
            </Link>
          </Button>
          {isLoggedIn ? (
            <>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/items/new">
                  <Plus className="h-5 w-5" />
                  <span className="sr-only">出品</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/users/me">
                  <User className="h-5 w-5" />
                  <span className="sr-only">マイページ</span>
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild className="hidden sm:inline-flex">
                <Link to="/login">ログイン</Link>
              </Button>
              <Button asChild>
                <Link to="/register">新規登録</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
