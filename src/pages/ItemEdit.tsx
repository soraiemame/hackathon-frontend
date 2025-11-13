import { useQuery, useMutation } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import apiClient from '../api/client'
import type { Item, ItemCreate } from '../types/item'
import { useState, useEffect } from 'react'

async function fetchItem(itemId: string): Promise<Item> {
  const { data } = await apiClient.get(`/api/items/${itemId}`)
  return data
}

async function updateItem(vars: { itemId: string, data: ItemCreate }): Promise<Item> {
  const { data } = await apiClient.put(`/api/items/${vars.itemId}`, vars.data)
  return data
}

export function ItemEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)

  const { data: item, isLoading } = useQuery({
    queryKey: ['itemDetail', id],
    queryFn: () => fetchItem(id!),
  })

  useEffect(() => {
    if (item) {
      setName(item.name)
      setPrice(item.price)
    }
  }, [item])

  const mutation = useMutation({
    mutationFn: updateItem,
    onSuccess: (updatedItem) => {
      navigate(`/items/${updatedItem.id}`)
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const updatedData: ItemCreate = { 
        name: name, 
        price: price, 
        description: item?.description || "", 
        image_keys: item?.images.map(img => img.image_key) || [] 
    }
    
    mutation.mutate({ itemId: id!, data: updatedData })
  }

  if (isLoading) return <div>ローディング中...</div>

  return (
    <form onSubmit={handleSubmit}>
      <h1>商品編集ページ</h1>
      <input type="text" value={name} onChange={e => setName(e.target.value)} />
      <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} />
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "更新中..." : "更新する"}
      </button>
    </form>
  )
}