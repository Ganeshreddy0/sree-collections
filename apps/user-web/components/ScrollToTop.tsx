"use client";

import { useEffect, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function ScrollToTopHandler() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const prevRouteRef = useRef<string>("");

  useEffect(() => {
    // Disable browser automatic scroll restoration so history transitions don't retain old scroll positions
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      try {
        window.history.scrollRestoration = "manual";
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    const currentUrl = `${pathname}${searchParams ? `?${searchParams.toString()}` : ""}`;
    const prevUrl = prevRouteRef.current;

    // Check if there is an in-page section hash (e.g., #featured on current page)
    const currentHash = typeof window !== "undefined" ? window.location.hash : "";
    const isAnchorOnly =
      currentHash &&
      currentHash !== "#" &&
      currentHash !== "#top" &&
      currentHash !== "#home" &&
      prevUrl &&
      prevUrl.split("#")[0] === currentUrl.split("#")[0];

    if (!isAnchorOnly) {
      // Execute scroll to top across window, html document, and body
      const scrollToTop = () => {
        if (typeof window === "undefined") return;
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        if (document.documentElement) document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;
      };

      // 1. Immediate scroll
      scrollToTop();

      // 2. Next animation frame (when DOM swaps)
      const rafId = requestAnimationFrame(scrollToTop);

      // 3. Staggered timeouts to guarantee top position even after async data/image layout shifts
      const t1 = setTimeout(scrollToTop, 40);
      const t2 = setTimeout(scrollToTop, 120);

      prevRouteRef.current = currentUrl;

      return () => {
        cancelAnimationFrame(rafId);
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }

    prevRouteRef.current = currentUrl;
  }, [pathname, searchParams]);

  useEffect(() => {
    // Global click listener to catch internal link/button clicks
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest("a") as HTMLAnchorElement | null;
      if (!anchor || !anchor.href) return;

      // Skip new tab clicks, external links, modifiers
      if (
        anchor.target === "_blank" ||
        anchor.hasAttribute("download") ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      try {
        const targetUrl = new URL(anchor.href, window.location.href);

        // Ignore external origin
        if (targetUrl.origin !== window.location.origin) return;

        const currentPath = window.location.pathname;
        const targetPath = targetUrl.pathname;
        const targetHash = targetUrl.hash;

        // In-page anchor on the same page (e.g. #featured) -> let normal anchor scroll happen
        if (
          targetPath === currentPath &&
          targetUrl.search === window.location.search &&
          targetHash &&
          targetHash !== "#" &&
          targetHash !== "#top" &&
          targetHash !== "#home"
        ) {
          return;
        }

        // Cross-page navigation OR clicking current page/logo/home to return to top
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        if (document.documentElement) document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;
      } catch {
        // ignore URL parsing errors
      }
    };

    document.addEventListener("click", handleGlobalClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleGlobalClick, { capture: true });
    };
  }, []);

  return null;
}

export default function ScrollToTop() {
  return (
    <Suspense fallback={null}>
      <ScrollToTopHandler />
    </Suspense>
  );
}
