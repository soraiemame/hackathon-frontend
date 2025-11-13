import { useQuery, useMutation } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import apiClient from '../api/client'
import type { Item } from '../types/item'
import type { Order } from '../types/order'

async function fetchItem(itemId: string): Promise<Item> {
  const { data } = await apiClient.get(`/api/items/${itemId}`)
  return data
}

async function purchaseItem(itemId: string): Promise<Order> {
  const { data } = await apiClient.post(`/api/items/${itemId}/purchase`)
  return data
}

export function Purchase() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: item, isLoading } = useQuery({
    queryKey: ['itemDetail', id],
    queryFn: () => fetchItem(id!),
  })
  
  const mutation = useMutation({
    mutationFn: () => purchaseItem(id!),
    onSuccess: (order) => {
      alert("購入が完了しました。取引ページに移動します。")
      navigate(`/orders/${order.id}`)
    },
    onError: (error: any) => {
      alert(`購入に失敗しました: ${error.response?.data?.detail || error.message}`)
    }
  })

  if (isLoading) return <div>ローディング中...</div>
  if (!item) return <div>商品が見つかりません。</div>

  return (
    <div>
      <h1>購入確認</h1>
      <img src={item.images[0]?.image_url} alt={item.name} width="200" />
      <h2>{item.name}</h2>
      <p>¥{item.price.toLocaleString()}</p>
      <p>本当に購入しますか？</p>
      <button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
        {mutation.isPending ? "処理中..." : "購入を確定する"}
      </button>
    </div>
  )
}