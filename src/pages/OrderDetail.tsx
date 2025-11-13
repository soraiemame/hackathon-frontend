import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import apiClient from '../api/client'
import type { Order } from '../types/order'

async function fetchOrder(orderId: string): Promise<Order> {
  const { data } = await apiClient.get(`/api/orders/${orderId}`)
  return data
}

export function OrderDetail() {
  const { id } = useParams<{ id: string }>()

  const { data: order, isLoading } = useQuery({
    queryKey: ['orderDetail', id],
    queryFn: () => fetchOrder(id!),
  })

  if (isLoading) return <div>ローディング中...</div>
  if (!order) return <div>取引が見つかりません。</div> // ここを元に削除済みだった場合の処理をする

  return (
    <div>
      <h1>取引詳細</h1>
      <p>取引ID: {order.id}</p>
      {/* <p>商品名: {order.item.name} {order.item.is_deleted ? "(削除済み商品)" : ""}</p> */}
      <p>ステータス: {order.status}</p>
    </div>
  )
}