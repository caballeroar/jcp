// "use client";

// import { useEffect, useRef, useState, useCallback } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { usePathname, useRouter } from "next/navigation";
// import LogoFull from "../../../public/assets/logo_full.svg";
// import LogoIcon from "../../../public/assets/logo_icon.svg";
// import { useI18n } from "../../lib/I18nContext";
// import LanguageSwitcher from "./Switcher/LanguageSwitcher";

// const DEFAULT_ITEMS = [
//   { label: "Services", slug: "services" },
//   { label: "Cases", slug: "cases" },
//   { label: "Methodology", slug: "methodology" },
//   { label: "About", slug: "about" },
//   { label: "Contact", slug: "contact" },
// ];

// const normalizePath = (path = "/") => {
//   if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
//   return path || "/";
// };

// export default function Menu({
//   items = DEFAULT_ITEMS,
//   showHeader = true,
//   className = "",
// }) {
//   const [open, setOpen] = useState(false);
//   const overlayRef = useRef(null);
//   const [onBrandBackground, setOnBrandBackground] = useState(false);
//   const router = useRouter();
//   const pathname = usePathname();
//   const currentPath = normalizePath(pathname);
//   const [pendingHref, setPendingHref] = useState(null);

//   const { locale } = useI18n();

//   const closeMenu = useCallback(() => {
//     setPendingHref(null);
//     setOpen(false);
//   }, []);

//   useEffect(() => {
//     if (!pendingHref) return;
//     if (normalizePath(pathname) === pendingHref) {
//       setPendingHref(null);
//       setOpen(false);
//     }
//   }, [pathname, pendingHref]);

//   useEffect(() => {
//     const onKey = (e) => {
//       if (e.key === "Escape") setOpen(false);
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, []);

//   useEffect(() => {
//     if (typeof window === "undefined") return;

//     const header = document.getElementById("site-header");
//     if (!header) return;

//     const brandSections = document.querySelectorAll("[data-brand-bg]");
//     if (!brandSections.length) return;

//     const updateState = () => {
//       const headerRect = header.getBoundingClientRect();
//       const headerHeight = headerRect.height || 0;

//       let overlapping = false;
//       brandSections.forEach((section) => {
//         const rect = section.getBoundingClientRect();
//         if (rect.top < headerHeight && rect.bottom > 0) {
//           overlapping = true;
//         }
//       });

//       setOnBrandBackground(overlapping);
//     };

//     updateState();
//     window.addEventListener("scroll", updateState, { passive: true });
//     window.addEventListener("resize", updateState);

//     return () => {
//       window.removeEventListener("scroll", updateState);
//       window.removeEventListener("resize", updateState);
//     };
//   }, [pathname]);

//   useEffect(() => {
//     if (open) {
//       const previous = document.body.style.overflow;
//       document.body.dataset.menuOverflow = previous;
//       document.body.style.overflow = "hidden";
//       return () => {
//         document.body.style.overflow = document.body.dataset.menuOverflow ?? "";
//         delete document.body.dataset.menuOverflow;
//       };
//     }
//   }, [open]);

//   const toggleMenu = () => {
//     setPendingHref(null);
//     setOpen((v) => !v);
//   };

//   const handleNavigate = useCallback(
//     (href, event) => {
//       if (event) event.preventDefault();
//       const normalized = normalizePath(href);
//       if (normalized === currentPath) {
//         closeMenu();
//         return;
//       }
//       setPendingHref(normalized);
//       router.push(href);
//     },
//     [router, currentPath, closeMenu],
//   );

//   const shouldInvertLogo = !open && onBrandBackground;
//   const imageFilter = shouldInvertLogo ? "brightness-0 invert" : "";
//   const desktopHeaderStyle = open
//     ? {
//         borderColor: "transparent",
//         background: "var(--bg_box_neutral)",
//       }
//     : {
//         borderColor: "color-mix(in srgb, var(--surface) 25%, transparent)",
//         background: "color-mix(in srgb, var(--background) 5%, transparent)",
//         backdropFilter: "blur(4px)",
//         WebkitBackdropFilter: "blur(4px)",
//       };
//   const mobileHeaderStyle = open
//     ? { borderColor: "transparent", background: "var(--bg_box_neutral)" }
//     : {
//         borderColor: "color-mix(in srgb, var(--surface) 25%, transparent)",
//         background: "color-mix(in srgb, var(--background) 10%, transparent)",
//         backdropFilter: "blur(10px)",
//         WebkitBackdropFilter: "blur(10px)",
//       };

//   const navItems = items?.length ? items : DEFAULT_ITEMS;

//   const buildHref = (slug = "") => (slug ? `/${locale}/${slug}` : `/${locale}`);

//   return (
//     <div className={`w-full ${className}`}>
//       {showHeader && (
//         <>
//           {/* Desktop header */}
//           <header
//             id="site-header"
//             className="hidden md:block fixed top-0 left-0 right-0 z-50 w-full border-b"
//             style={desktopHeaderStyle}
//           >
//             <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between tracking-normal">
//               <div className="flex items-center gap-3">
//                 <Link
//                   href={buildHref()}
//                   className="inline-flex"
//                   onClick={(e) => handleNavigate(buildHref(), e)}
//                 >
//                   <Image
//                     src={LogoFull}
//                     alt="Just Common People"
//                     height={36}
//                     className={imageFilter}
//                     priority
//                   />
//                 </Link>
//               </div>
//               <div className="flex items-center gap-3">
//                 <button
//                   type="button"
//                   onClick={toggleMenu}
//                   className="inline-flex items-center gap-2 px-4 text-sm font-bold translate-y-0.5 cursor-pointer text-[var(--content_dark)]"
//                   aria-expanded={open}
//                   aria-controls="site-menu-panel"
//                 >
//                   {open ? "CLOSE" : "MENU"}
//                 </button>
//                 <LanguageSwitcher />
//               </div>
//             </div>
//           </header>

//           {/* Mobile footer bar */}
//           <header
//             className="md:hidden fixed bottom-0 left-0 right-0 z-50 w-full border-t"
//             style={mobileHeaderStyle}
//           >
//             <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4 text-[var(--content_dark)]">
//               <Link
//                 href={buildHref()}
//                 className="inline-flex items-center gap-2"
//                 onClick={(e) => handleNavigate(buildHref(), e)}
//               >
//                 <Image
//                   src={LogoIcon}
//                   alt="Just Common People"
//                   height={28}
//                   className={imageFilter}
//                   priority
//                 />
//               </Link>

//               <button
//                 type="button"
//                 onClick={toggleMenu}
//                 className="text-sm font-bold tracking-wide uppercase"
//                 aria-expanded={open}
//                 aria-controls="site-menu-panel"
//               >
//                 {open ? "CLOSE" : "MENU"}
//               </button>

//               <div className="shrink-0">
//                 <LanguageSwitcher />
//               </div>
//             </div>
//           </header>
//         </>
//       )}

//       {/* Slide-out panel */}
//       {open && (
//         <div className="fixed inset-0 z-40 pointer-events-auto">
//           {/* Overlay */}
//           <div
//             ref={overlayRef}
//             onClick={closeMenu}
//             className="absolute inset-0 bg-black/40"
//           />
//           {/* Drawer */}
//           <nav
//             id="site-menu-panel"
//             className="absolute inset-0 bg-[var(--bg_box_neutral)] text-[var(--content_dark)] flex flex-col"
//             aria-hidden={!open}
//           >
//             <div className="flex-1 flex items-center justify-center px-6 py-10 text-center">
//               <div className="space-y-6">
//                 {navItems.map((item) => {
//                   const href = buildHref(item.slug);
//                   return (
//                     <Link
//                       key={item.slug}
//                       href={href}
//                       className="text-3xl md:text-4xl font-semibold tracking-tight hover:text-[var(--content_brand)] transition-colors block"
//                       onClick={(e) => handleNavigate(href, e)}
//                     >
//                       {item.label}
//                     </Link>
//                   );
//                 })}
//               </div>
//             </div>
//           </nav>
//         </div>
//       )}
//     </div>
//   );
// }
