"use client";

import {
    AnimatePresence,
    motion,
    PanInfo,
} from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import {
    ArrowLeft,
    ArrowRight,
} from "lucide-react";

const images = [
    "/images/hero/hero-visual.jpeg",
    "/images/hero/hero-visual-1.jpeg",
    "/images/hero/hero-visual-2.jpeg",
    "/images/hero/hero-visual-3.jpeg",
];

const INTERVAL_MS = 5000;

export default function HeroImageSlider() {
    const [index, setIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    /* --------------------------------
       NEXT SLIDE
    -------------------------------- */

    const nextSlide = useCallback(() => {
        setIndex((current) => {
            return (current + 1) % images.length;
        });
    }, []);

    /* --------------------------------
       PREVIOUS SLIDE
    -------------------------------- */

    const prevSlide = useCallback(() => {
        setIndex((current) => {
            return (
                (current - 1 + images.length) %
                images.length
            );
        });
    }, []);

    /* --------------------------------
       AUTOPLAY
    -------------------------------- */

    useEffect(() => {
        if (isHovered) return;

        const timer = setTimeout(() => {
            nextSlide();
        }, INTERVAL_MS);

        return () => {
            clearTimeout(timer);
        };
    }, [index, isHovered, nextSlide]);

    /* --------------------------------
       SWIPE / DRAG
    -------------------------------- */

    const handleDragEnd = (
        _: MouseEvent | TouchEvent | PointerEvent,
        info: PanInfo
    ) => {
        const swipeDistance = info.offset.x;

        if (swipeDistance < -70) {
            nextSlide();
        }

        if (swipeDistance > 70) {
            prevSlide();
        }
    };

    return (
        <div
            className="
                group relative h-full w-full
                overflow-hidden
                rounded-[20px]
                bg-[#f1f1ed]
                md:rounded-[28px]
            "
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* ==================================================
                IMAGE SLIDER
            ================================================== */}

            <AnimatePresence
                initial={false}
                mode="sync"
            >
                <motion.div
                    key={`${images[index]}-${index}`}
                    className="
                        absolute inset-0
                        cursor-grab
                        active:cursor-grabbing
                    "
                    initial={{
                        opacity: 0,
                        scale: 1.10,
                    }}
                    animate={{
                        opacity: 1,

                        /*
                         * Smooth:
                         * zoom in → zoom out
                         */
                        scale: [
                            1.10,
                            1.17,
                            1.10,
                        ],
                    }}
                    exit={{
                        opacity: 0,
                        scale: 1.12,
                    }}
                    transition={{
                        /*
                         * Fade transition
                         */
                        opacity: {
                            duration: 1.3,
                            ease: "easeInOut",
                        },

                        /*
                         * Cinematic zoom
                         */
                        scale: {
                            duration:
                                INTERVAL_MS / 1000,

                            ease: [
                                0.45,
                                0,
                                0.55,
                                1,
                            ],

                            times: [
                                0,
                                0.52,
                                1,
                            ],
                        },
                    }}
                    drag="x"
                    dragConstraints={{
                        left: 0,
                        right: 0,
                    }}
                    dragElastic={0.12}
                    onDragEnd={handleDragEnd}
                >
                    <Image
                        src={images[index]}
                        alt={`Digital experience ${index + 1}`}
                        fill
                        priority={index === 0}
                        draggable={false}
                        className="select-none object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                </motion.div>
            </AnimatePresence>

            {/* ==================================================
                IMAGE OVERLAY
            ================================================== */}

            <div
                className="
                    pointer-events-none
                    absolute inset-0
                    bg-gradient-to-t
                    from-black/25
                    via-transparent
                    to-black/5
                "
            />

            {/* ==================================================
                TOP RIGHT SLIDE COUNTER
            ================================================== */}

            {/* <div
                className="
                    absolute
                    right-5
                    top-5
                    z-20
                    md:right-7
                    md:top-7
                "
            >
                <div
                    className="
                        rounded-full
                        border
                        border-white/20
                        bg-black/20
                        px-3
                        py-1.5
                        backdrop-blur-md
                    "
                >
                    <span
                        className="
                            text-[14px]
                            font-medium
                            tracking-[0.18em]
                            text-white
                        "
                    >
                        {String(index + 1).padStart(
                            2,
                            "0"
                        )}
                    </span>

                    <span className="mx-1.5 text-white/40">
                        /
                    </span>

                    <span
                        className="
                            text-[14px]
                            font-medium
                            tracking-[0.18em]
                            text-white/60
                        "
                    >
                        {String(images.length).padStart(
                            2,
                            "0"
                        )}
                    </span>
                </div>
            </div> */}

            {/* ==================================================
                SLIDE LABEL
            ================================================== */}

            <div
                className="
                    absolute
                    bottom-[78px]
                    left-5
                    z-20
                    md:bottom-[82px]
                    md:left-7
                "
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={index}
                        initial={{
                            opacity: 0,
                            y: 12,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        exit={{
                            opacity: 0,
                            y: -8,
                        }}
                        transition={{
                            duration: 0.5,
                            ease: [
                                0.22,
                                1,
                                0.36,
                                1,
                            ],
                        }}
                    >
                        <span
                            className="
                                text-[10px]
                                font-medium
                                uppercase
                                tracking-[0.25em]
                                text-white/85
                            "
                        >
                            Digital Experience
                        </span>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* ==================================================
                BOTTOM CONTROLS
            ================================================== */}

            <div
                className="
                    absolute
                    bottom-5
                    left-5
                    right-5
                    z-20
                    flex
                    items-center
                    justify-between
                    gap-5
                    md:bottom-7
                    md:left-7
                    md:right-7
                "
            >
                {/* ----------------------------------------------
                    PROGRESS BARS
                ---------------------------------------------- */}

                <div
                    className="
                        flex
                        w-[45%]
                        max-w-[260px]
                        gap-1.5
                    "
                >
                    {images.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setIndex(i)}
                            aria-label={`Go to slide ${
                                i + 1
                            }`}
                            className="
                                relative
                                h-[3px]
                                flex-1
                                overflow-hidden
                                rounded-full
                                bg-white/30
                            "
                        >
                            {i === index && (
                                <motion.span
                                    key={`progress-${index}`}
                                    className="
                                        absolute
                                        inset-y-0
                                        left-0
                                        bg-white
                                    "
                                    initial={{
                                        width: "0%",
                                    }}
                                    animate={{
                                        width: "100%",
                                    }}
                                    transition={{
                                        duration:
                                            INTERVAL_MS /
                                            1000,
                                        ease: "linear",
                                    }}
                                />
                            )}

                            {i !== index && (
                                <span
                                    className="
                                        absolute
                                        inset-0
                                        origin-left
                                        scale-x-0
                                        bg-white/70
                                        transition-transform
                                        duration-300
                                    "
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* ----------------------------------------------
                    NAVIGATION BUTTONS
                ---------------------------------------------- */}

                <div className="flex gap-2">
                    {/* PREVIOUS */}

                    <button
                        onClick={prevSlide}
                        aria-label="Previous slide"
                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-white/25
                            bg-black/20
                            text-white
                            backdrop-blur-md
                            transition-all
                            duration-300
                            hover:bg-white
                            hover:text-black
                            md:h-11
                            md:w-11
                        "
                    >
                        <ArrowLeft
                            size={17}
                            strokeWidth={1.7}
                        />
                    </button>

                    {/* NEXT */}

                    <button
                        onClick={nextSlide}
                        aria-label="Next slide"
                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-white/25
                            bg-black/20
                            text-white
                            backdrop-blur-md
                            transition-all
                            duration-300
                            hover:bg-white
                            hover:text-black
                            md:h-11
                            md:w-11
                        "
                    >
                        <ArrowRight
                            size={17}
                            strokeWidth={1.7}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
}