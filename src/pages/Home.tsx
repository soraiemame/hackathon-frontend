import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { CardContent } from "../components/ui/card";
import { ShoppingBag } from "lucide-react";
import { Shield, Users, Zap } from "lucide-react";

export function Home() {
  return (
    <div className="flex flex-col">
      <section className="container px-4 py-16 md:py-24 md:px-6">
        <div className="flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-balance">
            誰でも簡単に
            <span className="text-primary block mt-2">売り買いができる</span>
          </h1>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl">
            フリマは、安心安全な取引をサポートするフリマアプリです。
            今すぐ始めて、あなたの不要なものを誰かの必要なものに。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button size="lg" asChild>
              <Link to="/register">無料で始める</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/items">商品を見る</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container px-4 py-16 md:px-6 bg-muted/30">
        <h2 className="text-3xl font-bold text-center mb-12">フリマの特徴</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">簡単出品</h3>
                <p className="text-muted-foreground text-sm">
                  写真を撮って、商品情報を入力するだけ。
                  誰でも簡単に出品できます。
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">安心取引</h3>
                <p className="text-muted-foreground text-sm">
                  エスクローシステムで、商品が届くまで
                  代金は運営が安全に保管します。
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">即日発送</h3>
                <p className="text-muted-foreground text-sm">
                  多くの出品者が即日発送に対応。 すぐに商品が手に入ります。
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">充実のサポート</h3>
                <p className="text-muted-foreground text-sm">
                  困ったときは24時間365日対応の
                  カスタマーサポートがサポートします。
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">手数料無料</h3>
                <p className="text-muted-foreground text-sm">
                  出品手数料は無料。売れたときだけ 販売価格の10%をいただきます。
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">匿名配送</h3>
                <p className="text-muted-foreground text-sm">
                  お互いの住所を知られることなく、 安心して取引できます。
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container px-4 py-16 md:py-24 md:px-6">
        <div className="flex flex-col items-center text-center gap-6 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
            今すぐ始めよう
          </h2>
          <p className="text-lg text-muted-foreground">
            無料登録して、フリマを始めましょう
          </p>
          <Button size="lg" asChild>
            <Link to="/register">無料登録</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
