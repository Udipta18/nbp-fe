"use client";

import { useEffect } from "react";

export function ServicePageScrollHandler() {
    useEffect(() => {
        // Immediate scroll
        window.scrollTo(0, 0);

        // Also scroll after a tiny delay to override any scroll restoration
        const timeout1 = setTimeout(() => {
            window.scrollTo(0, 0);
        }, 0);

        // And again after Next.js might have restored scroll
        const timeout2 = setTimeout(() => {
            window.scrollTo(0, 0);
        }, 50);

        return () => {
            clearTimeout(timeout1);
            clearTimeout(timeout2);
        };
    }, []);

    return null;
}
