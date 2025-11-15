import { Link } from 'react-router-dom'
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { PackageX } from "lucide-react"

export function NotFound() {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <PackageX className="h-10 w-10 text-destructive" />
          </div>
          <CardTitle className="text-2xl text-center">404 - Not Found</CardTitle>
          <CardDescription className="text-center">
            お探しのページは見つかりませんでした。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground">
            URLが間違っているか、ページが削除された可能性があります。
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button asChild className="w-full">
            <Link to="/">ホームに戻る</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}