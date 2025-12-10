import { useState, useMemo, useEffect } from "react";
import { useCategories } from "../hooks/useCategory";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface CategorySelectorProps {
  /** カテゴリーIDが確定したときに呼ばれるコールバック */
  onChange: (categoryId: number | undefined) => void;
  className?: string;
}

export function CategorySelector({ onChange, className }: CategorySelectorProps) {
  const { data: categories } = useCategories();

  // 状態はここで管理
  const [selectedC0, setSelectedC0] = useState<string>("all");
  const [selectedC1, setSelectedC1] = useState<string>("all");
  const [selectedC2, setSelectedC2] = useState<string>("all");

  // ID計算ロジック
  const targetCategoryId = useMemo(() => {
    if (selectedC2 !== "all") return Number(selectedC2);
    // 必要であればここで C1, C0 のIDを返すことも可能
    return undefined;
  }, [selectedC2]);

  // 親に変更を通知
  useEffect(() => {
    onChange(targetCategoryId);
  }, [targetCategoryId, onChange]);

  // --- ヘルパー: 「その他」を末尾にするソート関数 ---
  const sortOthersLast = (a: { label: string }, b: { label: string }) => {
    if (a.label === "その他") return 1;  // aがその他の場合、後ろへ
    if (b.label === "その他") return -1; // bがその他の場合、後ろへ（aは前へ）
    return 0; // それ以外は並び替えない（または文字コード順 a.label.localeCompare(b.label)）
  };

  // --- 1. 大カテゴリ (c0) ---
  const c0List = useMemo(() => {
    if (!categories) return [];
    const map = new Map();
    categories.forEach((c) => {
      const label = c.c0_name_jp;
      const value = c.c0_name;
      // 重複排除ロジック (Other優先)
      if (map.has(label)) {
        if (map.get(label).value === "Others" && value === "Other") {
          map.set(label, { value, label });
        }
        return;
      }
      map.set(label, { value, label });
    });
    
    // ▼ ソート適用
    return Array.from(map.values()).sort(sortOthersLast);
  }, [categories]);

  // --- 2. 中カテゴリ (c1) ---
  const c1List = useMemo(() => {
    if (!categories || selectedC0 === "all") return [];
    const map = new Map();
    categories
      .filter((c) => c.c0_name === selectedC0)
      .forEach((c) => {
        const label = c.c1_name_jp;
        const value = c.c1_name;
        if (map.has(label)) return;
        map.set(label, { value, label });
      });

    // ▼ ソート適用
    return Array.from(map.values()).sort(sortOthersLast);
  }, [categories, selectedC0]);

  // --- 3. 小カテゴリ (c2) ---
  const c2List = useMemo(() => {
    if (!categories || selectedC1 === "all") return [];
    const map = new Map();
    categories
      .filter((c) => c.c1_name === selectedC1 && c.c0_name === selectedC0)
      .forEach((c) => {
        const label = c.c2_name_jp;
        const id = String(c.id);
        if (map.has(label)) return;
        map.set(label, { value: id, label });
      });

    // ▼ ソート適用
    return Array.from(map.values()).sort(sortOthersLast);
  }, [categories, selectedC1, selectedC0]);

  // ハンドラー
  const handleC0Change = (val: string) => {
    setSelectedC0(val);
    setSelectedC1("all");
    setSelectedC2("all");
  };
  const handleC1Change = (val: string) => {
    setSelectedC1(val);
    setSelectedC2("all");
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* 大カテゴリ */}
      <Select value={selectedC0} onValueChange={handleC0Change}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="大カテゴリー" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">指定なし</SelectItem>
          {c0List.map((c: any) => (
            <SelectItem key={c.value} value={c.value}>
              {c.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* 中カテゴリ */}
      <Select
        value={selectedC1}
        onValueChange={handleC1Change}
        disabled={selectedC0 === "all"}
      >
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="中カテゴリー" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">指定なし</SelectItem>
          {c1List.map((c: any) => (
            <SelectItem key={c.value} value={c.value}>
              {c.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* 小カテゴリ */}
      <Select
        value={selectedC2}
        onValueChange={setSelectedC2}
        disabled={selectedC1 === "all"}
      >
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="小カテゴリー" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">指定なし</SelectItem>
          {c2List.map((c: any) => (
            <SelectItem key={c.value} value={c.value}>
              {c.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}