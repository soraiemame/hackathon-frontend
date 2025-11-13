import { useQuery } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import apiClient from '../api/client'
import type { Item } from '../types/item'
import type { Comment } from '../types/comment'
import { useAuth } from '../contexts/Auth'

async function fetchItem(itemId: string): Promise<Item> {
  const { data } = await apiClient.get(`/api/items/${itemId}`)
  return data
}

async function fetchComments(itemId: string): Promise<Comment[]> {
  const { data } = await apiClient.get(`/api/items/${itemId}/comments`)
  return data
}

export function ItemDetail() {
  const { id } = useParams<{ id: string }>()
  const { isLoggedIn } = useAuth() 

  const { data: item, isLoading: isLoadingItem } = useQuery({
    queryKey: ['itemDetail', id],
    queryFn: () => fetchItem(id!),
  })

  const { data: comments, isLoading: isLoadingComments } = useQuery({
    queryKey: ['itemComments', id],
    queryFn: () => fetchComments(id!),
  })

  if (isLoadingItem || isLoadingComments) return <div>ローディング中...</div>
  if (!item) return <div>商品が見つかりません。</div>

  return (
    <div>
      {isLoggedIn && (
        <nav>
          <Link to={`/items/${item.id}/purchase`}>購入ページへ</Link> | 
          <Link to={`/items/${item.id}/edit`}>編集ページへ</Link>
        </nav>
      )}

      <h1>{item.name}</h1>
      <img src={item.images[0]?.image_url} alt={item.name} width="400" />
      <p>¥{item.price.toLocaleString()}</p>
      <p>{item.description}</p>
      
      <h2>コメント一覧</h2>
      <ul>
        {comments?.map(comment => <li key={comment.id}>{comment.body}</li>)}
      </ul>
    </div>
  )
}