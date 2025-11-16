"use client";

import { Link } from "react-router-dom";
import { Search, ShoppingBag, User, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useAuth } from "../contexts/Auth";

export function Header() {
  const { isLoggedIn } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4 px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <ShoppingBag className="h-6 w-6 text-primary" />
          <span className="text-pretty">フリマ</span>
        </Link>

        <div className="flex flex-1 items-center gap-4 md:gap-6 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="商品を検索"
              className="pl-9 bg-muted/50"
            />
          </div>
        </div>

        <nav className="flex items-center gap-2">
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
