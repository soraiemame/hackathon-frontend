"use client";

import { Heart, MessageCircle, ShoppingBag, Volume2, VolumeX } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import type { Short } from "../../types/short";
import { useState } from "react";

interface OverlayInfoProps {
    short: Short;
    isMuted: boolean;
    onToggleMute: () => void;
}

export default function OverlayInfo({ short, isMuted, onToggleMute }: OverlayInfoProps) {
    const [isLiked, setIsLiked] = useState(false); // Mock state

    return (
        <div className="absolute inset-0 z-20 pointer-events-none">
            {/* Top Left: Seller */}
            <div className="absolute left-0 right-0 top-0 p-4 pointer-events-auto">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-white cursor-pointer" onClick={() => window.location.href = `/users/${short.seller.id}`}>
                        <AvatarImage src={short.seller.avatar_url || "/placeholder.svg"} />
                        <AvatarFallback>{short.seller.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm font-medium text-white drop-shadow-lg">{short.seller.name}</p>
                    </div>
                </div>
            </div>

            {/* Mute Toggle */}
            <button
                onClick={onToggleMute}
                className="absolute top-4 right-4 p-2 bg-black/30 rounded-full backdrop-blur-sm pointer-events-auto text-white"
            >
                {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </button>

            {/* Right: Actions */}
            <div className="absolute bottom-32 right-4 flex flex-col items-center gap-6 pointer-events-auto">
                <button onClick={() => setIsLiked(!isLiked)} className="flex flex-col items-center gap-1 transition-transform active:scale-90">
                    <div className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-full backdrop-blur-sm",
                        isLiked ? "bg-red-500/90" : "bg-white/20"
                    )}>
                        <Heart className={cn("h-6 w-6 transition-colors", isLiked ? "fill-white text-white" : "text-white")} />
                    </div>
                </button>

                <button className="flex flex-col items-center gap-1 transition-transform active:scale-90">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                        <MessageCircle className="h-6 w-6 text-white" />
                    </div>
                </button>
            </div>

            {/* Bottom: Product Info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent pt-12">
                <div className="space-y-3 pointer-events-auto">
                    <div>
                        <h2 className="text-balance text-2xl font-bold text-white drop-shadow-lg line-clamp-2">{short.title}</h2>
                        <p className="mt-1 text-3xl font-bold text-white drop-shadow-lg">
                            ¥{short.price.toLocaleString()}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="secondary"
                            className="flex-1 rounded-full bg-white/90 font-semibold text-black backdrop-blur-sm hover:bg-white"
                            onClick={() => window.open(`/items/${short.item_id}`, '_blank')}
                        >
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            商品ページへ
                        </Button>
                    </div>

                    {short.description && (
                        <div className="text-white/80 text-sm line-clamp-1">
                            {short.description}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
