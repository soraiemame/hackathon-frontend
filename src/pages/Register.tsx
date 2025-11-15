import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate, Link } from 'react-router-dom'
import apiClient from '../api/client'
import type { User } from '../types/user'

// v0 
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Checkbox } from "../components/ui/checkbox"
import { ShoppingBag } from "lucide-react"

// 
async function registerUser(vars: { 
    email: string; 
    password: string; 
    username: string 
}): Promise<User> {
    const { data } = await apiClient.post('/api/register', {
        email: vars.email,
        password: vars.password,
        username: vars.username,
    })
    return data
}

export function Register() {
    // v0
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [terms, setTerms] = useState(false)
    
    const navigate = useNavigate()

    const mutation = useMutation({
        mutationFn: registerUser,
        onSuccess: () => {
            alert('登録が完了しました。ログインページに移動します。')
            navigate('/login')
        },
        onError: (error: any) => {
            if (error.response?.status === 409) {
                alert('このメールアドレスは既に使用されています。')
            } else {
                alert(`登録に失敗しました: ${error.message}`)
            }
        },
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        
        // 
        if (password !== confirmPassword) {
            alert("パスワードが一致しません。")
            return
        }
        if (!terms) {
            alert("利用規約に同意してください。")
            return
        }
        
        mutation.mutate({ email, password, username })
    }

    return (
        <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] px-4 py-8">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-center mb-4">
                        <ShoppingBag className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="text-2xl text-center">新規登録</CardTitle>
                    <CardDescription className="text-center">アカウントを作成してフリマを始めましょう</CardDescription>
                </CardHeader>
                
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">ユーザー名</Label>
                            <Input 
                                id="username" 
                                type="text" 
                                placeholder="yamada_taro" 
                                required 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">メールアドレス</Label>
                            <Input 
                                id="email" 
                                type="email" 
                                placeholder="your@email.com" 
                                required 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">パスワード</Label>
                            <Input 
                                id="password" 
                                type="password" 
                                placeholder="8文字以上" 
                                required 
                                minLength={8}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">パスワード（確認）</Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                placeholder="もう一度入力してください"
                                required
                                minLength={8}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <div className="flex items-start space-x-2">
                            <Checkbox 
                                id="terms" 
                                required
                                checked={terms}
                                onCheckedChange={(checked) => setTerms(checked as boolean)}
                            />
                            <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                                <Link to="/terms" className="text-primary hover:underline">
                                    利用規約
                                </Link>
                                と
                                <Link to="/privacy" className="text-primary hover:underline ml-1">
                                    プライバシーポリシー
                                </Link>
                                に同意します
                            </label>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button 
                            type="submit" 
                            className="w-full"
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? '登録中...' : '登録する'}
                        </Button>
                        <p className="text-center text-sm text-muted-foreground">
                            すでにアカウントをお持ちの方は
                            <Link to="/login" className="text-primary hover:underline ml-1">
                                ログイン
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}