import { Link } from "react-router-dom"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"

interface ItemCardProps {
  id: number
  name: string
  price: number
  image: string
  condition?: string
  isSold?: boolean
}

export function ItemCard({ id, name, price, image, condition, isSold }: ItemCardProps) {
  return (
    <Link to={`/items/${id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={image || "/placeholder.svg"}
            alt={name}
            className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
          />
          {isSold && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                売り切れ
              </Badge>
            </div>
          )}
          {condition && !isSold && <Badge className="absolute top-2 left-2 bg-primary">{condition}</Badge>}
        </div>
        <CardContent className="p-3">
          <h3 className="font-medium text-sm line-clamp-2 mb-2 min-h-[2.5rem]">{name}</h3>
          <p className="text-lg font-bold text-primary">¥{price.toLocaleString()}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
