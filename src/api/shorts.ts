import apiClient from "./client";
import type { Short } from "../types/short";

export async function fetchShorts(cursor?: number): Promise<Short[]> {
    const params: Record<string, any> = { limit: 10 };
    if (cursor) {
        params.cursor = cursor;
    }
    const { data } = await apiClient.get<Short[]>("/api/shorts", { params });
    return data;
}
