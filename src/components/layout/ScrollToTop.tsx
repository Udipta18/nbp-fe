"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function ScrollToTop() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Scroll to top on every route change
        window.scrollTo(0, 0);

        // Also set history scroll restoration to manual
        if ("scrollRestoration" in history) {
            history.scrollRestoration = "manual";
        }
    }, [pathname, searchParams]);

    return null;
}
