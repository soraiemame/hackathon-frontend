"use client"

import { useState, useEffect } from "react"
import { Heart, MessageCircle, X, Volume2, VolumeX } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { cn } from "../../lib/utils"
import { ScrollArea } from "../../components/ui/scroll-area"
import { useAuth } from "../../contexts/Auth"
import AudioPlayer from "./AudioPlayer"
import { type Short } from "../../types/short"
import { useItemLike } from "../../hooks/useLike"
import { toast } from "sonner"
import apiClient from "../../api/client"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Navigation, Autoplay } from "swiper/modules"
import "swiper/css"
// @ts-expect-error Swiper css types are missing
import "swiper/css/pagination"
// @ts-expect-error Swiper css types are missing
import "swiper/css/navigation"

interface ShortsItemProps {
    short: Short
    isActive: boolean
    isMuted: boolean
    toggleMute: () => void
}

export default function ShortsItem({ short, isActive, isMuted, toggleMute }: ShortsItemProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [isDescriptionOpen, setIsDescriptionOpen] = useState(false)
    const [isCommentsOpen, setIsCommentsOpen] = useState(false)
    const [hasInteracted, setHasInteracted] = useState(false)

    // Comments State
    const [comments, setComments] = useState<any[]>([])
    const [newComment, setNewComment] = useState("")
    const [isCommentsLoading, setIsCommentsLoading] = useState(false)

    const { isLoggedIn, user: currentUser } = useAuth()


    // Like Logic using custom hook
    // Note: useItemLike expects string usually, but let's check hook definition
    // Hook: useItemLike(itemId: string | undefined)
    const { likeCount, isLiked, toggleLike, isLikeProcessing } = useItemLike(String(short.item_id))

    const productImages = short.images || []
    const currentImage = productImages[currentImageIndex] || "/placeholder.svg"
    const currentSlide = short.slides?.find(s => s.index === currentImageIndex)

    // Reset interaction states when slide becomes inactive
    useEffect(() => {
        if (!isActive) {
            setIsDescriptionOpen(false)
            setIsCommentsOpen(false)
            setHasInteracted(false)
            // Optional: Reset image index? usually better to keep it
        }
    }, [isActive])

    // Fetch comments when comments sheet is opened
    useEffect(() => {
        if (isCommentsOpen && short.item_id) {
            setIsCommentsLoading(true)
            apiClient.get(`/api/items/${short.item_id}/comments`)
                .then(res => {
                    const data = res.data;
                    setComments(data.map((c: any) => ({
                        id: String(c.id),
                        author: c.user?.username || `User ${c.user_id}`,
                        avatar: c.user?.icon_url || "/placeholder.svg",
                        content: c.body,
                        timestamp: c.created_at,
                        likes: 0 // API doesn't return comment likes yet
                    })))
                })
                .catch(err => console.error("Failed to fetch comments", err))
                .finally(() => setIsCommentsLoading(false))
        }
    }, [isCommentsOpen, short.item_id])


    // Navigation handlers removed in favor of Swiper

    const handlePostComment = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newComment.trim() || !isLoggedIn) {
            if (!isLoggedIn) toast.error("ログインが必要です");
            return
        }

        try {
            // Note: apiClient automatically attaches Authorization header if logged in (handled by AuthProvider)
            const res = await apiClient.post(`/api/items/${short.item_id}/comments`, { body: newComment })

            if (res.status === 200 || res.status === 201) {
                const commentData = res.data;
                // Fix: Removed duplicate declaration and .json() call

                const newC = {
                    id: String(commentData.id),
                    author: currentUser?.username || "Me",
                    avatar: currentUser?.icon_url || "/placeholder.svg",
                    content: commentData.body,
                    timestamp: "Just now",
                    likes: 0
                }
                setComments(prev => [...prev, newC])
                setNewComment("")
            } else {
                toast.error("コメントの投稿に失敗しました")
            }
        } catch (e) {
            console.error("Post comment failed", e)
            toast.error("エラーが発生しました")
        }
    }

    const handleLikeClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!isLoggedIn) {
            toast.error("ログインが必要です")
            return
        }
        if (Number(short.seller.id) === currentUser?.id) {
            toast.error("自分の商品にはいいねできません")
            return
        }
        toggleLike()
    }

    return (
        <div className="relative w-full h-full bg-black overflow-hidden select-none">
            {/* Audio Player */}
            {short.audio_url && (
                <AudioPlayer
                    src={short.audio_url}
                    isActive={isActive}
                    isMuted={isMuted}
                />
            )}

            {/* Mute toggle button */}
            <button
                onClick={(e) => { e.stopPropagation(); toggleMute() }}
                className="absolute top-4 right-4 z-20 p-2 bg-black/40 rounded-full text-white hover:bg-black/60 transition-colors"
                title={isMuted ? "Unmute" : "Mute"}
            >
                {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
            </button>

            {/* Main Content Area */}
            <div className="absolute inset-0 flex items-center justify-center bg-black overflow-hidden">
                <div className="relative w-full h-full max-w-[500px] mx-auto">
                    {/* Blurred Background */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src={currentImage}
                            alt="background"
                            className="absolute inset-0 w-full h-full object-cover blur-xl scale-125 opacity-50"
                        />
                        <div className="absolute inset-0 bg-black/30" />
                    </div>

                    {/* Main Image Swiper */}
                    <div
                        className="relative z-10 w-full h-full flex items-center justify-center"
                        onTouchStart={() => setHasInteracted(true)}
                        onMouseDown={() => setHasInteracted(true)}
                    >
                        <div className="relative w-full max-h-full aspect-[9/16] max-w-full" style={{ "--swiper-navigation-color": "#fff", "--swiper-pagination-color": "#fff" } as React.CSSProperties}>
                            <Swiper
                                direction="horizontal"
                                className="w-full h-full"
                                modules={[Pagination, Navigation, Autoplay]}
                                pagination={{ clickable: true }}
                                navigation={false} // Disable navigation arrows
                                autoplay={{
                                    delay: 5000,
                                    disableOnInteraction: true, // Stop autoplay after user swipe
                                    stopOnLastSlide: false,
                                }}
                                onSlideChange={(swiper) => setCurrentImageIndex(swiper.activeIndex)}
                                onTouchStart={() => setHasInteracted(true)}
                                nested={true}
                            >
                                {productImages.length > 0 ? productImages.map((img, idx) => (
                                    <SwiperSlide key={idx} className="flex items-center justify-center overflow-hidden">
                                        <img
                                            src={img || "/placeholder.svg"}
                                            alt={`${short.title} - ${idx + 1}`}
                                            className={cn(
                                                "w-full h-full object-contain transition-transform duration-700",
                                                !hasInteracted && isActive && "animate-ken-burns-loop"
                                            )}
                                            style={{
                                                // Reset animation when slide changes (conceptually handled by key prop usually)
                                                // or strictly controlled by class presence.
                                                willChange: "transform"
                                            }}
                                        />
                                    </SwiperSlide>
                                )) : (
                                    <SwiperSlide className="flex items-center justify-center overflow-hidden">
                                        <img
                                            src="/placeholder.svg"
                                            alt={short.title}
                                            className={cn(
                                                "w-full h-full object-contain",
                                                !hasInteracted && isActive && "animate-ken-burns-loop"
                                            )}
                                        />
                                    </SwiperSlide>
                                )}
                            </Swiper>
                        </div>
                    </div>

                    {/* Subtitles Overlay */}
                    {currentSlide && (
                        <div
                            className={cn(
                                "absolute z-20 w-full flex justify-center pointer-events-none",
                                currentSlide.position === 0 ? "top-[15%]" : "bottom-[25%]"
                            )}
                        >
                            <div className="max-w-[80%] mx-auto text-center px-4">
                                <p
                                    className={cn(
                                        "text-xl md:text-2xl font-black drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] inline-block",
                                        currentSlide.color === 0
                                            ? "text-black bg-white/70 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-white/20"
                                            : "text-white"
                                    )}
                                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
                                >
                                    {currentSlide.subtitle}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 pointer-events-none z-10" />
                </div>
            </div>

            {/* Removed Manual Arrows and Indicators (Swiper has builtin pagination) */}

            {/* Right Side Actions */}
            <div className="absolute bottom-32 right-3 z-30 flex flex-col items-center gap-5 md:gap-6 md:bottom-24 md:right-4 pointer-events-auto">
                <button
                    onClick={handleLikeClick}
                    className="flex flex-col items-center gap-1 transition-transform active:scale-90"
                    disabled={isLikeProcessing}
                >
                    <div
                        className={cn(
                            "flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200",
                            isLiked ? "bg-red-500 scale-110" : "bg-black/30 backdrop-blur-sm hover:bg-black/50",
                        )}
                    >
                        <Heart className={cn("h-6 w-6 transition-all", isLiked ? "fill-white text-white" : "text-white")} />
                    </div>
                    <span className="text-xs font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                        {likeCount}
                    </span>
                </button>

                <button
                    onClick={(e) => { e.stopPropagation(); setIsCommentsOpen(true) }}
                    className="flex flex-col items-center gap-1 transition-transform active:scale-90"
                >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm transition-colors hover:bg-black/50">
                        <MessageCircle className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                        {comments.length}
                    </span>
                </button>
            </div>

            {/* Bottom Info */}
            <div className="absolute bottom-0 left-0 right-0 z-20 p-4 pb-6 md:pb-8 max-w-[500px] mx-auto pointer-events-none">
                <div className="space-y-2 pointer-events-auto">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8 border-2 border-white">
                            <AvatarImage src={short.seller.avatar_url || "/placeholder.svg"} />
                            <AvatarFallback>{short.seller.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                            {short.seller.name}
                        </span>
                    </div>

                    <div>
                        <h2 className="text-balance text-base font-semibold leading-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] md:text-lg">
                            {short.title}
                        </h2>
                        <p className="mt-1 text-2xl font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] md:text-3xl">
                            ¥{short.price.toLocaleString()}
                        </p>
                    </div>

                    <button
                        onClick={(e) => { e.stopPropagation(); setIsDescriptionOpen(true) }}
                        className="flex items-center gap-1 text-sm font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] transition-opacity hover:opacity-80"
                    >
                        <span>概要を見る</span>
                    </button>
                </div>
            </div>

            {/* Comments Sheet */}
            {isCommentsOpen && (
                <>
                    <div
                        className="absolute inset-0 z-30 bg-black/50 md:bg-black/30"
                        onClick={(e) => { e.stopPropagation(); setIsCommentsOpen(false) }}
                        aria-hidden="true"
                    />
                    <div className="absolute bottom-0 left-0 right-0 z-40 max-h-[85vh] rounded-t-3xl bg-background shadow-2xl transition-transform md:inset-y-0 md:left-auto md:right-0 md:max-h-none md:w-[420px] md:rounded-none m-auto select-text">
                        <div className="flex h-full flex-col">
                            <div className="flex items-center justify-between border-b border-border p-4">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-semibold">コメント</h3>
                                    <span className="text-sm text-muted-foreground">{comments.length}</span>
                                </div>
                                <button
                                    onClick={() => setIsCommentsOpen(false)}
                                    className="rounded-full p-1 hover:bg-accent transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <ScrollArea className="flex-1">
                                <div className="p-4 space-y-4">
                                    {comments.length > 0 ? (
                                        comments.map((comment) => (
                                            <div key={comment.id} className="flex gap-3">
                                                <Avatar className="h-10 w-10 flex-shrink-0">
                                                    <AvatarImage src={comment.avatar || "/placeholder.svg"} />
                                                    <AvatarFallback>{comment.author[0]}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-sm">{comment.author}</span>
                                                        <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                                                    </div>
                                                    <p className="text-sm leading-relaxed">{comment.content}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex justify-center items-center h-40 text-muted-foreground">
                                            {isCommentsLoading ? "読み込み中..." : "コメントはまだありません"}
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>

                            <div className="border-t border-border p-4">
                                <form onSubmit={handlePostComment} className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={currentUser?.icon_url || "/placeholder.svg"} />
                                        <AvatarFallback>{currentUser?.username?.[0] || "U"}</AvatarFallback>
                                    </Avatar>
                                    <input
                                        type="text"
                                        placeholder={isLoggedIn ? "コメントする..." : "ログインしてコメント"}
                                        className="flex-1 rounded-full bg-secondary px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        disabled={!isLoggedIn}
                                    />
                                    <button type="submit" disabled={!newComment.trim() || !isLoggedIn}>
                                        <MessageCircle className={cn("h-6 w-6", newComment.trim() ? "text-primary" : "text-muted-foreground")} />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Description Sheet */}
            {isDescriptionOpen && (
                <>
                    <div
                        className="absolute inset-0 z-30 bg-black/60 backdrop-blur-sm md:bg-black/30"
                        onClick={(e) => { e.stopPropagation(); setIsDescriptionOpen(false) }}
                        aria-hidden="true"
                    />
                    <div className="absolute inset-x-0 bottom-0 z-40 max-h-[85vh] rounded-t-3xl bg-background shadow-2xl md:inset-y-0 md:left-auto md:right-0 md:max-h-none md:w-[420px] md:rounded-none m-auto select-text">
                        <div className="relative p-6 space-y-4 h-full overflow-y-auto">
                            <button
                                onClick={() => setIsDescriptionOpen(false)}
                                className="absolute right-4 top-4 rounded-full bg-secondary p-2 transition-colors hover:bg-accent z-10"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            <div>
                                <h3 className="text-2xl font-bold text-foreground">{short.title}</h3>
                                <p className="mt-1 text-3xl font-bold text-foreground">¥{short.price.toLocaleString()}</p>
                            </div>

                            <div className="flex items-center gap-3 border-y border-border py-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={short.seller.avatar_url || "/placeholder.svg"} />
                                    <AvatarFallback>{short.seller.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-foreground">{short.seller.name}</p>
                                    <p className="text-sm text-muted-foreground">出品者</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="mb-2 font-semibold text-foreground">商品説明</h4>
                                <p className="leading-relaxed text-muted-foreground whitespace-pre-wrap">{short.description}</p>
                            </div>

                            <Button
                                className="w-full rounded-full font-semibold sticky bottom-0"
                                size="lg"
                                onClick={() => {
                                    window.location.href = `/items/${short.item_id}`
                                }}
                            >
                                商品ページを見る
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
