import { useQuery } from '@tanstack/react-query'
import apiClient from '../api/client'
import type { Item } from '../types/item'
import { Link } from 'react-router-dom'

async function fetchItems(): Promise<Item[]> {
  const { data } = await apiClient.get('/api/items')
  return data
}

export function ItemList() {
  const { data, isLoading } = useQuery({
    queryKey: ['items'],
    queryFn: fetchItems,
  })

  if (isLoading) return <div>ローディング中...</div>

  return (
    <div>
      <h1>商品一覧</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {data?.map(item => (
          <div key={item.id} style={{ border: '1px solid #ccc', margin: 8, padding: 8 }}>
            <Link to={`/items/${item.id}`}>
              <img src={item.images[0]?.image_url} alt={item.name} width="200" height="200" style={{ objectFit: 'cover' }} />
              <p>{item.name}</p>
              <p>¥{item.price.toLocaleString()}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}