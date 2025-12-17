import { useEffect, useRef } from "react";

interface AudioPlayerProps {
    src: string;
    isActive: boolean;
    isMuted: boolean;
    onEnded?: () => void;
}

export default function AudioPlayer({ src, isActive, isMuted, onEnded }: AudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isActive) {
            // Attempt to play
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch((error) => {
                    console.log("Autoplay prevented:", error);
                    // UI should probably reflect that explicit interaction is needed
                });
            }
        } else {
            audio.pause();
            audio.currentTime = 0;
        }
    }, [isActive, src]); // Re-run if active state or src changes

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.muted = isMuted;
        }
    }, [isMuted]);

    return (
        <audio
            ref={audioRef}
            src={src}
            loop
            muted={isMuted} // Initial mute state
            onEnded={onEnded}
            className="hidden" // Invisible player
        />
    );
}
