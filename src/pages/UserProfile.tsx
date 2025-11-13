import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import apiClient from '../api/client'
import type { User } from '../types/user'

async function fetchUser(userId: string): Promise<User> {
  const { data } = await apiClient.get(`/api/users/${userId}`)
  return data
}

export function UserProfile() {
  const { id } = useParams<{ id: string }>()

  const { data: user, isLoading } = useQuery({
    queryKey: ['userProfile', id],
    queryFn: () => fetchUser(id!),
  })

  if (isLoading) return <div>ローディング中...</div>
  if (!user) return <div>ユーザーが見つかりません。</div>

  return (
    <div>
      <h1>{user.username || user.email} さんのプロフィール</h1>
      <p>登録日: {user.created_at}</p>
      <h2>出品した商品</h2>
    </div>
  )
}