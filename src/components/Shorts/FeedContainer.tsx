"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { useShortsFeed } from "../../hooks/useShortsFeed"
import { useSearchParams } from "react-router-dom"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Keyboard } from 'swiper/modules';


// Import Swiper styles
import 'swiper/css';

import ShortsItem from "./ShortsItem"

export default function FeedContainer() {
    const { shorts, isLoading, loadMore, hasMore } = useShortsFeed()
    const [activeIndex, setActiveIndex] = useState(0)
    const [isMuted, setIsMuted] = useState(true)
    const [searchParams] = useSearchParams()

    // Initial load logic with Swiper is tricky if shorts are empty.
    // We already handle empty state below.

    // Handle initial Item ID
    const [initialIndex, setInitialIndex] = useState(0)
    useEffect(() => {
        const initialItemId = searchParams.get("initialItemId")
        if (initialItemId && shorts.length > 0) {
            const index = shorts.findIndex(s => s.item_id === Number(initialItemId))
            if (index !== -1) {
                setInitialIndex(index)
                setActiveIndex(index)
            }
        }
    }, [shorts.length, searchParams]) // Only run when shorts length changes (loaded)

    // Load more when reaching end
    useEffect(() => {
        if (hasMore && !isLoading && shorts.length - activeIndex <= 3) {
            loadMore()
        }
    }, [activeIndex, hasMore, isLoading, loadMore, shorts.length])


    if (shorts.length === 0 && isLoading) {
        return (
            <div className="flex h-[100dvh] w-full items-center justify-center bg-black text-white">
                <Loader2 className="h-10 w-10 animate-spin" />
            </div>
        )
    }

    if (shorts.length === 0 && !isLoading) {
        return (
            <div className="flex h-[100dvh] w-full items-center justify-center bg-black text-white">
                <p>No shorts available.</p>
            </div>
        )
    }

    return (
        <div style={{ height: "calc(100dvh - 64px)" }} className="bg-black w-full overflow-hidden overscroll-none touch-none">
            <Swiper
                direction={'vertical'}
                className="h-full w-full"
                onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                initialSlide={initialIndex}
                modules={[Mousewheel, Keyboard]}
                mousewheel={true}
                keyboard={{ enabled: true }}
                threshold={10} // Enhance touch sensitivity for vertical swipe
            >
                {shorts.map((short, index) => (
                    <SwiperSlide key={short.item_id}>
                        {/* Only render content if active or near active to save resources? 
                            Swiper handles DOM recycling to some extent but for video/heavy content
                            we might want to trigger `isActive` prop.
                        */}
                        <ShortsItem
                            short={short}
                            isActive={index === activeIndex}
                            isMuted={isMuted}
                            toggleMute={() => setIsMuted(!isMuted)}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}
