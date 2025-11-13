import { useQuery } from '@tanstack/react-query'
import { useNavigate, Link } from 'react-router-dom'
import apiClient from '../api/client'
import { useAuth } from '../contexts/Auth'
import type { User } from '../types/user'
import type { Order } from '../types/order'

async function fetchMyProfile(): Promise<User> {
    const { data } = await apiClient.get('/api/users/me')
    return data
}

async function fetchMyOrders(): Promise<Order[]> {
    const { data } = await apiClient.get('/api/orders/me')
    return data
}

export function MyPage() {
    const auth = useAuth()
    const navigate = useNavigate()

    const { data: user, isLoading: isLoadingUser } = useQuery({
        queryKey: ['myProfile'],
        queryFn: fetchMyProfile,
    })

    const { data: orders, isLoading: isLoadingOrders } = useQuery({
        queryKey: ['myOrders'],
        queryFn: fetchMyOrders,
    })

    const handleLogout = () => {
        auth.logout()
        navigate('/')
    }

    if (isLoadingUser || isLoadingOrders) {
        return <div>ローディング中...</div>
    }

    return (
        <div>
            <h1>マイページ</h1>
            
            <h2>ようこそ、{user?.username || user?.email} さん</h2>
            <p>ここにプロフィール情報を表示します。</p>
            {/* <Link to="/account/edit">プロフィールを編集</Link> */}
            <hr />

            <h2>あなたの取引履歴</h2>
            {orders && orders.length > 0 ? (
                <ul>
                    {orders.map(order => (
                        <li key={order.id}>
                            <Link to={`/orders/${order.id}`}>
                                {order.item.name} ({order.status})
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>取引履歴はまだありません。</p>
            )}
            
            <hr />
            <button onClick={handleLogout}>ログアウト</button>
        </div>
    )
}