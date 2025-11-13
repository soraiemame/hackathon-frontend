import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div>
      <h1>404 - Not Found</h1>
      <p>お探しのページは見つかりませんでした。</p>
      <Link to="/">ホームに戻る</Link>
    </div>
  )
}