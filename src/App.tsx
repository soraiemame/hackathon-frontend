import { useQuery } from '@tanstack/react-query';
import apiClient from './api/client';
import type { Item } from './types/item';

async function fetchItems(): Promise<Item[]> {
  const response = await apiClient.get('/items');
  return response.data;
}

function App() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['items'],
    queryFn: fetchItems,
  });

  if (isLoading) {
    return <div>ローディング中...</div>;
  }

  if (isError) {
    return <div>エラーが発生しました</div>;
  }

  return (
    <div>
      <h1>商品一覧</h1>
      <ul>
        {data?.map(item => (
          <li key={item.id}>{item.name} ({item.price}円)</li>
        ))}
      </ul>
    </div>
  );
}

export default App;