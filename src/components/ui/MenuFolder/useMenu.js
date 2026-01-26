"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const normalizePath = (path = "/") =>
  path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;

export function useMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const currentPath = normalizePath(pathname);

  const toggle = useCallback(() => {
    setOpen((v) => !v);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  const navigate = useCallback(
    (href, event) => {
      event?.preventDefault();
      if (normalizePath(href) === currentPath) {
        close();
        return;
      }
      router.push(href);
    },
    [router, currentPath, close],
  );

  // Escape key handling
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  // Body scroll lock (stream-safe)
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    close();
  }, [currentPath, close]);

  return {
    open,
    toggle,
    close,
    navigate,
  };
}
