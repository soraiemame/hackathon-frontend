export type Slide = {
    index: number;
    subtitle: string;
    position: number; // 0 for top, 1 for bottom
    color: number; // 0 for black, 1 for white
};

export type ShortSeller = {
    id: number;
    name: string;
    avatar_url: string | null;
};

export type Short = {
    item_id: number;
    title: string;
    price: number;
    description: string | null;
    audio_url: string | null;
    slides: Slide[];
    status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
    images: string[];
    seller: ShortSeller;
    likes?: number;
    comments?: ShortComment[];
};

export type ShortComment = {
    id: string;
    author: string;
    avatar: string;
    content: string;
    timestamp: string;
    likes: number;
};
