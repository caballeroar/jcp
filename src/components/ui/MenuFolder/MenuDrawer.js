"use client";

import { useMenuContext } from "./MenuProvider";

export function MenuDrawer({ items, buildHref }) {
  const { open, close, navigate } = useMenuContext();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/40" onClick={close} />
      <nav className="absolute inset-0 bg-[var(--bg_box_neutral)] flex items-center justify-center">
        <div className="space-y-6 text-center">
          {items.map((item) => {
            if (!item) return null;
            const href = buildHref(item.slug);
            const rawLabel =
              item.label ?? (item.slug ? item.slug.replace(/-/g, " ") : null);
            if (!rawLabel) return null;
            const label = rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1);
            return (
              <a
                key={item.slug ?? href}
                href={href}
                onClick={(e) => navigate(href, e)}
                className="block text-3xl md:text-4xl font-semibold"
              >
                {label}
              </a>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
