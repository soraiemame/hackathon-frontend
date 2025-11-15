import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate, Link } from 'react-router-dom'
import apiClient from '../api/client'
import { useAuth } from '../contexts/Auth'

import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { ShoppingBag } from "lucide-react"

interface LoginResponse {
    access_token: string;
}

async function loginUser(formData: FormData): Promise<LoginResponse> {
    console.log(formData)
    const { data } = await apiClient.post('/api/login', formData, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    })
    return data
}

export function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const auth = useAuth()

    const mutation = useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            auth.login(data.access_token)
            navigate('/users/me')
        },
        onError: () => {
            alert('メールアドレスまたはパスワードが間違っています。')
        },
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('username', username)
        formData.append('password', password)
        mutation.mutate(formData)
    }

    return (
        <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] px-4 py-8">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-center mb-4">
                        <ShoppingBag className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="text-2xl text-center">ログイン</CardTitle>
                    <CardDescription className="text-center">アカウント情報を入力してログインしてください</CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">メールアドレス</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">パスワード</Label>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? 'ログイン中...' : 'ログイン'}
                        </Button>

                        <Link to="/forgot-password" className="text-sm text-primary hover:underline text-center">
                            パスワードを忘れた場合
                        </Link>

                        <p className="text-center text-sm text-muted-foreground">
                            アカウントをお持ちでない方は
                            <Link to="/register" className="text-primary hover:underline ml-1">
                                新規登録
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}