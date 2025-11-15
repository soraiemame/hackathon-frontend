import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './contexts/Auth'

import { Header } from './components/header'
import { Footer } from './components/footer'
import { Home } from './pages/Home'
import { Register } from './pages/Register'
import { Login } from './pages/Login'
import { MyPage } from './pages/MyPage'

import { ItemList } from './pages/ItemList'
import { Search } from './pages/Search'
import { ItemDetail } from './pages/ItemDetail'
import { UserProfile } from './pages/UserProfile'
import { ItemCreate } from './pages/ItemCreate'
import { ItemEdit } from './pages/ItemEdit'
import { Purchase } from './pages/Purchase'
import { OrderDetail } from './pages/OrderDetail'
import { NotFound } from './pages/NotFound'

import './index.css'
import { FullPageLoader } from './components/ui/full-page-loader'

function ProtectedRoute() {
    const { isLoggedIn, isInitializing } = useAuth()
    
    if (isInitializing) {
        return <FullPageLoader />
    }
    
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />
    }
    
    return <Outlet />
}

function GuestRoute() {
    const { isLoggedIn, isInitializing } = useAuth()

    if (isInitializing) {
        return <FullPageLoader />
    }
    
    if (isLoggedIn) {
        return <Navigate to="/users/me" replace />
    }

    return <Outlet />
}

function App() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header /><main className="flex-1"><Routes>
                <Route element={<GuestRoute />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                </Route>

                <Route element={<ProtectedRoute />}>
                    {/* <Route path="/users/me" element={<MyPage />}>
                        <Route index element={<MyProfileDisplay />} />
                        <Route path="edit" element={<AccountEdit />} />
                        <Route path="orders" element={<MyOrderHistory />} />
                    </Route> */}
                    <Route path="/users/me" element={<MyPage />} />
                    <Route path="/items/new" element={<ItemCreate />} />
                    <Route path="/items/:id/edit" element={<ItemEdit />} />
                    <Route path="/items/:id/purchase" element={<Purchase />} />
                    <Route path="/orders/:id" element={<OrderDetail />} />
                </Route>

                <Route path="/items" element={<ItemList />} />
                <Route path="/items/search" element={<Search />} />
                <Route path="/items/:id" element={<ItemDetail />} />
                <Route path="/users/:id" element={<UserProfile />} />

                <Route path="*" element={<NotFound />} />
            </Routes></main><Footer />
        </div>
    )
}

export default App