import { Link } from 'react-router-dom'

export function Home() {
    return (
        <div>
            <h1>フリマアプリへようこそ</h1>
            <nav>
                <Link to="/login">ログイン</Link>
                <br />
                <Link to="/register">新規登録</Link>
            </nav>
        </div>
    )
}