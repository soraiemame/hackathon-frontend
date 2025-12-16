import { useState, useMemo, useEffect } from "react";
import { useCategories } from "../hooks/useCategory";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface CategorySelectorProps {
  value?: number;
  onChange: (categoryId: number | undefined) => void;
  className?: string;
  isVertical?: boolean;
}

interface CategoryItem {
  value: string;
  label: string;
}

export function CategorySelector({
  value,
  onChange,
  className,
  isVertical = false,
}: CategorySelectorProps) {
  const { data: categories } = useCategories();

  // 内部状態
  const [selectedC0, setSelectedC0] = useState<string>("all");
  const [selectedC1, setSelectedC1] = useState<string>("all");
  const [selectedC2, setSelectedC2] = useState<string>("all");

  // --- 1. 大カテゴリ (c0) リスト ---
  const c0List = useMemo(() => {
    if (!categories) return [];
    const map = new Map<string, CategoryItem>();
    categories.forEach((c) => {
      // 比較・重複排除用に小文字化したキーを使用
      const key = c.c0_name.trim().toLowerCase();
      if (map.has(key)) {
        return;
      }

      // "その他" の重複対策: c0_name_jp が "その他" でも、c0_name が "Other" でないものは除外
      if (c.c0_name_jp === "その他" && c.c0_name !== "Other") {
        return;
      }

      map.set(key, { value: c.c0_name, label: c.c0_name_jp });
    });
    // その他を末尾にするソート
    return Array.from(map.values()).sort((a: CategoryItem, b: CategoryItem) => {
      if (a.label === "その他") return 1;
      if (b.label === "その他") return -1;
      return 0;
    });
  }, [categories]);

  // --- 2. 中カテゴリ (c1) リスト ---
  const c1List = useMemo(() => {
    if (!categories || selectedC0 === "all") return [];
    const map = new Map<string, CategoryItem>();
    // 選択中のC0に基づいてフィルタリング
    let bestOther: CategoryItem | null = null;

    const filteredC1 = categories.filter((c) => c.c0_name === selectedC0);
    for (const c of filteredC1) {
      const key = c.c1_name.trim().toLowerCase();
      if (map.has(key)) continue;

      // "その他" の特別扱い
      if (c.c1_name_jp === "その他") {
        // value (c1_name) が "その他" 以外のものを優先する
        if (
          !bestOther ||
          (bestOther.value === "その他" && c.c1_name !== "その他")
        ) {
          bestOther = { value: c.c1_name, label: c.c1_name_jp };
        }
        continue;
      }

      map.set(key, { value: c.c1_name, label: c.c1_name_jp });
    }

    // ベストな「その他」があれば追加
    if (bestOther) {
      map.set(bestOther.value.trim().toLowerCase(), bestOther);
    }

    return Array.from(map.values()).sort((a: CategoryItem, b: CategoryItem) => {
      if (a.label === "その他") return 1;
      if (b.label === "その他") return -1;
      return 0;
    });
  }, [categories, selectedC0]);

  // --- 3. 小カテゴリ (c2) リスト ---
  const c2List = useMemo(() => {
    if (!categories || selectedC1 === "all") return [];
    const map = new Map<string, CategoryItem>();
    let bestOther: {
      value: string;
      label: string;
      internalName: string;
    } | null = null;

    const filteredC2 = categories.filter((c) => c.c1_name === selectedC1 && c.c0_name === selectedC0);
    for (const c of filteredC2) {
      // C2はIDが一意なのでそのまま使用
      const idStr = String(c.id);
      if (map.has(idStr)) continue;

      // "その他" の特別扱い
      if (c.c2_name_jp === "その他") {
        // c2_name が "その他" 以外のものを優先する
        if (
          !bestOther ||
          (bestOther.internalName === "その他" && c.c2_name !== "その他")
        ) {
          bestOther = {
            value: idStr,
            label: c.c2_name_jp,
            internalName: c.c2_name,
          };
        }
        continue;
      }

      map.set(idStr, { value: idStr, label: c.c2_name_jp });
    }

    if (bestOther) {
      // internalName を除外してマップに追加
      const { value, label } = bestOther;
      map.set(value, { value, label });
    }

    return Array.from(map.values()).sort((a: CategoryItem, b: CategoryItem) => {
      if (a.label === "その他") return 1;
      if (b.label === "その他") return -1;
      return 0;
    });
  }, [categories, selectedC1, selectedC0]);

  // --- ハンドラー ---
  const handleC0Change = (val: string) => {
    setSelectedC0(val);
    setSelectedC1("all");
    setSelectedC2("all");
    onChange(undefined);
  };

  const handleC1Change = (val: string) => {
    setSelectedC1(val);
    setSelectedC2("all");
    onChange(undefined);
  };

  const handleC2Change = (val: string) => {
    setSelectedC2(val);
    if (val !== "all") {
      onChange(Number(val));
    } else {
      onChange(undefined);
    }
  };

  // --- 親からの反映ロジック ---
  useEffect(() => {
    if (!categories || categories.length === 0) return;
    if (value === undefined) return;
    if (String(value) === selectedC2) return;

    // 1. ターゲットとなる行データを探す
    const target = categories.find((c) => c.id === value);

    if (!target) return;
    // 2. スペルの揺らぎを吸収して正しい値を特定する

    // C0の特定
    const targetC0Key = target.c0_name.trim().toLowerCase();
    const foundC0 = c0List.find(
      (i: CategoryItem) => i.value.trim().toLowerCase() === targetC0Key,
    );
    const finalC0 = foundC0 ? foundC0.value : target.c0_name;

    // C1の特定 (targetと同じC0を持つデータ群から探す)
    const relevantCategories = categories.filter((c) => c.c0_name === finalC0);
    const targetC1Key = target.c1_name.trim().toLowerCase();
    const matchedC1Obj = relevantCategories.find(
      (c) => c.c1_name.trim().toLowerCase() === targetC1Key,
    );
    const finalC1 = matchedC1Obj ? matchedC1Obj.c1_name : target.c1_name;

    // 3. 状態を一括更新
    setSelectedC0(finalC0);
    setSelectedC1(finalC1);
    setSelectedC2(String(target.id));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, categories]);

  const containerLayout = isVertical
    ? "flex flex-col gap-4"
    : "flex flex-col gap-4 sm:flex-row";

  // 縦並びモードなら "w-full" 固定、そうでなければ "sm:w-[200px]" (PCで幅固定) を適用
  const itemWrapperClass = isVertical
    ? "w-full"
    : "w-full sm:w-[200px]";

  return (
    <div className={`${containerLayout} ${className || ""}`}>
      <div className={itemWrapperClass}>
        <Select value={selectedC0} onValueChange={handleC0Change}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="大カテゴリー" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            {c0List.map((item: CategoryItem) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className={itemWrapperClass}>
        <Select
          key={selectedC0}
          value={selectedC1}
          onValueChange={handleC1Change}
          disabled={selectedC0 === "all"}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="中カテゴリー" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            {c1List.map((item: CategoryItem) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className={itemWrapperClass}>
        <Select
          key={selectedC1}
          value={selectedC2}
          onValueChange={handleC2Change}
          disabled={selectedC1 === "all"}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="小カテゴリー" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            {c2List.map((item: CategoryItem) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
