import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate, Link } from 'react-router-dom'
import apiClient from '../api/client'
import type { User } from '../types/user'

async function registerUser(vars: { email: string; password: string }): Promise<User> {
    const { data } = await apiClient.post('/api/register', {
        email: vars.email,
        password: vars.password,
    })
    return data
}

export function Register() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const mutation = useMutation({
        mutationFn: registerUser,
        onSuccess: () => {
            alert('登録が完了しました。ログインページに移動します。')
            navigate('/login')
        },
        onError: (error) => {
            alert(`登録に失敗しました: ${error.message}`)
        },
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        mutation.mutate({ email, password })
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>新規登録</h2>
            <div>
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
            </div>
            <button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? '登録中...' : '登録'}
            </button>
            <br />
            <Link to="/login">すでにアカウントをお持ちですか？ ログイン</Link>
        </form>
    )
}