import { Link } from "react-router-dom"

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container px-4 py-8 md:px-6">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="font-semibold mb-3">フリマについて</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="#" className="hover:text-foreground transition-colors">
                  会社概要
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-foreground transition-colors">
                  利用規約
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-foreground transition-colors">
                  プライバシーポリシー
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">サポート</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="#" className="hover:text-foreground transition-colors">
                  ヘルプセンター
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-foreground transition-colors">
                  お問い合わせ
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-foreground transition-colors">
                  安全な取引のために
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">ガイド</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="#" className="hover:text-foreground transition-colors">
                  出品方法
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-foreground transition-colors">
                  購入方法
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-foreground transition-colors">
                  配送について
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">フォロー</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="#" className="hover:text-foreground transition-colors">
                  Twitter
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-foreground transition-colors">
                  Instagram
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-foreground transition-colors">
                  Facebook
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          © 2025 フリマ. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
