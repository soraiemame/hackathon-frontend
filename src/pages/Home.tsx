import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { CardContent } from "../components/ui/card";
import { Smartphone, Shield, Search, Layers, Sparkles, Wand2 } from "lucide-react";

export function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container px-4 py-16 md:py-24 md:px-6">
        <div className="flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">
          <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary font-medium mb-2">
            画像が動き出す、新しいショッピング体験
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-balance">
            Shorts感覚で
            <span className="text-primary block mt-2">未知のアイテムと出会う</span>
          </h1>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl">
            FLICKA（フリッカ）は、いつもの商品画像をショート動画のような没入感で楽しめる次世代フリマアプリ。
            スワイプするたびに、あなたの知らない「欲しいモノ」が次々と現れます。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button size="lg" asChild>
              <Link to="/register">今すぐ始める</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              {/* リンク先を /items/shorts に変更 */}
              <Link to="/items/shorts" className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                体験してみる
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container px-4 py-16 md:px-6 bg-muted/30">
        <h2 className="text-3xl font-bold text-center mb-4">FLICKAの特徴</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          最新のUI体験と、AIによるサポート、そしてフリマアプリとしての安心感を両立しました。
        </p>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Feature 1: The "Like Video" Experience */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Layers className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">没入型の商品閲覧</h3>
                <p className="text-muted-foreground text-sm">
                  静止画を自動で切り替え、まるでショート動画を見ているような感覚に。
                  商品の魅力を直感的に、スピーディーにチェックできます。
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Feature 2: Serendipity (Discovery) */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">未知との出会い</h3>
                <p className="text-muted-foreground text-sm">
                  検索ワードが思いつかなくても大丈夫。
                  タイムラインを流し見するだけで、思いがけない掘り出し物に出会えます。
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Feature 3: Speed/UI */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Smartphone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">サクサク操作</h3>
                <p className="text-muted-foreground text-sm">
                  興味がなければスワイプ、気に入ればタップ。
                  片手で完結するストレスフリーな操作性を実現しました。
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Feature 4: Standard Search (Basic Function) */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">充実の検索機能</h3>
                <p className="text-muted-foreground text-sm">
                  もちろん、キーワード検索やカテゴリ絞り込みも完備。
                  欲しいものが決まっている時も、通常のフリマと同様に使えます。
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Feature 5: Safety (Basic Function) */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">安心・安全な取引</h3>
                <p className="text-muted-foreground text-sm">
                  お金のやり取りは運営が仲介するエスクロー方式。
                  匿名配送にも対応し、個人情報もしっかり守ります。
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Feature 6: AI Listing (Updated) */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Wand2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">AIアシスト出品</h3>
                <p className="text-muted-foreground text-sm">
                  写真を撮って数項目埋めるだけ。
                  あとはAIが画像から解析して、面倒な説明文やタグを自動で補完します。
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
            まずはスワイプしてみよう
          </h2>
          <p className="text-lg text-muted-foreground">
            会員登録は無料。今すぐFLICKAで、新しい買い物の楽しさを体験してください。
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild>
              <Link to="/register">無料で登録する</Link>
            </Button>
            {/* 「詳しい使い方」ボタンを削除 */}
          </div>
        </div>
      </section>
    </div>
  );
}