import { useQuery } from '@tanstack/react-query'
import apiClient from '../api/client'
import type { User } from '../types/user'
import type { Order } from '../types/order'
import type { Item } from '../types/item'
import { useAuth } from '../contexts/Auth'

// 
import { ProfileHeader } from './ProfileHeader'
import { ProfileTabs } from './ProfileTabs'
import { useNavigate } from 'react-router-dom'
import { FullPageLoader } from '../components/ui/full-page-loader'

async function fetchMyOrders(): Promise<Order[]> {
    const { data } = await apiClient.get('/api/orders/me')
    return data
}

async function fetchMyListings(userId: number): Promise<Item[]> {
    const { data } = await apiClient.get('/api/items', {
        params: { seller_id: userId }
    })
    return data
}

export interface MyPageContextType {
    user: User | null; // 
    orders: Order[] | undefined;
}

export function MyPage() {
    const auth = useAuth()
    const { user } = auth;

    const { data: orders, isLoading: isLoadingOrders } = useQuery({
        queryKey: ['myOrders'],
        queryFn: fetchMyOrders,
    })

    const { data: listings, isLoading: isLoadingListings } = useQuery({
        queryKey: ['myListings', user?.id],
        queryFn: () => fetchMyListings(user!.id),
        enabled: !!user,
    })

    if (isLoadingOrders || isLoadingListings) {
        return <FullPageLoader />
    }

    if (!user) {
        return <div>ユーザー情報の読み込みに失敗しました。</div>
    }

    return (
        <div className="container px-4 py-8 md:px-6">
            <ProfileHeader user={user} />

            <ProfileTabs user={user} orders={orders} listings={listings} />
        </div>
    )
}