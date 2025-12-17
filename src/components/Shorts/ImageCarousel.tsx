import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import type { Slide } from "../../types/short";
import { cn } from "../../lib/utils";

interface ImageCarouselProps {
    images: string[];
    title: string;
    slides: Slide[];
}

export default function ImageCarousel({ images, title, slides }: ImageCarouselProps) {
    if (!images || images.length === 0) {
        return <div className="w-full h-full bg-black/80 flex items-center justify-center text-white">No Image</div>;
    }

    return (
        <div className="relative w-full h-full">
            {/* Swiper */}
            <Swiper
                direction="horizontal"
                className="w-full h-full"
                spaceBetween={0}
                slidesPerView={1}
                nested={true} // Allow nested swiping inside vertical swiper
            >
                {images.map((src, index) => {
                    // Find subtitle for this image index
                    const slideInfo = slides.find(s => s.index === index);

                    return (
                        <SwiperSlide key={index} className="relative w-full h-full flex items-center justify-center overflow-hidden">
                            {/* Blurred Background */}
                            <div className="absolute inset-0 z-0">
                                <img
                                    src={src}
                                    alt="background"
                                    className="absolute inset-0 w-full h-full object-cover blur-xl scale-125 opacity-50"
                                />
                                <div className="absolute inset-0 bg-black/30" />
                            </div>

                            {/* Main Image */}
                            <div className="relative z-10 w-full h-full flex items-center justify-center">
                                <div className="relative w-full max-h-full aspect-[9/16] max-w-full">
                                    <img
                                        src={src}
                                        alt={`${title} - ${index + 1}`}
                                        className="w-full h-full object-contain"
                                        loading={index === 0 ? "eager" : "lazy"}
                                    />
                                </div>
                            </div>

                            {/* Subtitle Overlay */}
                            {slideInfo && (
                                <div
                                    className={cn(
                                        "absolute z-20 w-full px-8 text-center",
                                        slideInfo.position === 0 ? "top-[15%]" : "bottom-[25%]"
                                    )}
                                >
                                    <p
                                        className={cn(
                                            "text-2xl md:text-3xl font-black drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]",
                                            slideInfo.color === 0 ? "text-black bg-white/50 backdrop-blur-sm p-2 rounded-lg" : "text-white"
                                        )}
                                        style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
                                    >
                                        {slideInfo.subtitle}
                                    </p>
                                </div>
                            )}
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </div>
    );
}
