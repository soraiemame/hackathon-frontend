import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate, Link } from 'react-router-dom'
import apiClient from '../api/client'
import { useAuth } from '../contexts/Auth'

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
        <form onSubmit={handleSubmit}>
            <h2>ログイン</h2>
            <div>
                <label>Email (username):</label>
                <input type="email" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div>
                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'ログイン中...' : 'ログイン'}
            </button>
            <br />
            <Link to="/register">アカウントをお持ちでないですか？ 新規登録</Link>
        </form>
    )
}