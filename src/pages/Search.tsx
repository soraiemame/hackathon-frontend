import { useQuery } from '@tanstack/react-query'
import apiClient from '../api/client'
import type { Item } from '../types/item'
import { useSearchParams, Link } from 'react-router-dom'
import { useState } from 'react'

async function searchItems(query: string): Promise<Item[]> {
  const { data } = await apiClient.get(`/api/items`, {
    params: { search: query }
  })
  return data
}

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '')
  
  const query = searchParams.get('q') || ''

  const { data, isLoading } = useQuery({
    queryKey: ['itemSearch', query],
    queryFn: () => searchItems(query),
    enabled: !!query,
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchParams({ q: searchTerm })
  }

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input 
          type="text" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          placeholder="商品を検索..."
        />
        <button type="submit">検索</button>
      </form>

      <h2>検索結果</h2>
      {isLoading && <div>検索中...</div>}
      {data?.map(item => (
        <div key={item.id}>
          <Link to={`/items/${item.id}`}>{item.name}</Link>
        </div>
      ))}
    </div>
  )
}