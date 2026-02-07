"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageCarouselProps {
    images: string[];
    aspectRatio?: string;
    showThumbnails?: boolean;
}

export function ImageCarousel({
    images,
    aspectRatio = "aspect-[16/10]",
    showThumbnails = false
}: ImageCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    // Handle empty or single image
    if (!images || images.length === 0) {
        return (
            <div className={`${aspectRatio} bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center`}>
                <span className="text-slate-400">No images</span>
            </div>
        );
    }

    if (images.length === 1) {
        return (
            <div className={`${aspectRatio} relative overflow-hidden bg-slate-100`}>
                <img
                    src={images[0]}
                    alt="Gallery"
                    className="w-full h-full object-contain"
                />
            </div>
        );
    }

    const goToPrevious = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const goToNext = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const goToSlide = (index: number) => {
        setDirection(index > currentIndex ? 1 : -1);
        setCurrentIndex(index);
    };

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction > 0 ? -300 : 300,
            opacity: 0,
        }),
    };

    return (
        <div className="relative">
            {/* Main Image */}
            <div className={`${aspectRatio} relative overflow-hidden bg-slate-100`}>
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.img
                        key={currentIndex}
                        src={images[currentIndex]}
                        alt={`Gallery ${currentIndex + 1}`}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="absolute inset-0 w-full h-full object-contain"
                    />
                </AnimatePresence>

                {/* Navigation Arrows */}
                <button
                    onClick={goToPrevious}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
                    aria-label="Previous image"
                >
                    <ChevronLeft className="h-5 w-5 text-slate-700" />
                </button>
                <button
                    onClick={goToNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
                    aria-label="Next image"
                >
                    <ChevronRight className="h-5 w-5 text-slate-700" />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                    {currentIndex + 1} / {images.length}
                </div>
            </div>

            {/* Dot Indicators */}
            <div className="flex justify-center gap-1.5 mt-3">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                            ? "bg-blue-600 w-4"
                            : "bg-slate-300 hover:bg-slate-400"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Thumbnails (optional) */}
            {showThumbnails && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${index === currentIndex
                                ? "border-blue-600"
                                : "border-transparent opacity-60 hover:opacity-100"
                                }`}
                        >
                            <img
                                src={image}
                                alt={`Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
