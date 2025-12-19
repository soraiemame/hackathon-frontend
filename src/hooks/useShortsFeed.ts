import { useState, useCallback, useEffect } from "react";
import { fetchShorts } from "../api/shorts";
import type { Short } from "../types/short";

export function useShortsFeed() {
    const [shorts, setShorts] = useState<Short[]>([]);
    const [nextCursor, setNextCursor] = useState<number | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const loadMore = useCallback(async () => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);
        try {
            const newShorts = await fetchShorts(nextCursor);

            if (newShorts.length === 0) {
                setHasMore(false);
            } else {
                setShorts((prev) => {
                    const uniqueNewShorts = newShorts.filter(
                        (ns) => !prev.some((ps) => ps.item_id === ns.item_id)
                    );
                    return [...prev, ...uniqueNewShorts];
                });
                // Cursor-based pagination: assume descending order by ID on backend
                // So the last item's ID is the cursor for the next page
                const lastItem = newShorts[newShorts.length - 1];
                setNextCursor(lastItem.item_id);
            }
        } catch (error) {
            console.error("Failed to fetch shorts:", error);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, hasMore, nextCursor]);

    // Initial load
    useEffect(() => {
        if (shorts.length === 0 && hasMore) {
            loadMore();
        }
    }, []); // Only run once on mount if empty

    return { shorts, isLoading, loadMore, hasMore };
}
