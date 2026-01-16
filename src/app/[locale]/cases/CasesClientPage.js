"use client";

import { useState, useEffect } from "react";
import Folder from "../../../components/ui/Folder/Folder";
import { ArrowLeft, ArrowRight, X } from "phosphor-react";

export default function CasesClientPage({
  initialFolders,
  locale,
  heading,
  buttonLabel,
  prevProjectLabel,
  nextProjectLabel,
  closeLabel,
  initialExpandedSlug,
}) {
  const folders = initialFolders || [];

  const [expandedIndex, setExpandedIndex] = useState(() => {
    if (!initialExpandedSlug || !folders.length) return null;
    const idx = folders.findIndex((f) => f.slug === initialExpandedSlug);
    return idx >= 0 ? idx : null;
  });

  const handleExpand = (index) => {
    setExpandedIndex(index);
  };

  const handleClose = () => {
    setExpandedIndex(null);
  };

  useEffect(() => {
    if (expandedIndex !== null) {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previousOverflow || "";
      };
    }
  }, [expandedIndex]);

  const handleNext = () => {
    if (!folders.length || expandedIndex === null) return;
    setExpandedIndex((prev) => (prev + 1) % folders.length);
  };

  const handlePrev = () => {
    if (!folders.length || expandedIndex === null) return;
    setExpandedIndex((prev) => (prev - 1 + folders.length) % folders.length);
  };

  const outlinedHeading =
    "text font-monument-extended text-stroke-brand text-8xl md:text-9xl tracking-tight";

  return (
    <main className="min-h-screen bg-background text-foreground p-8 ">
      <div className="flex justify-center my-40">
        <h1 className={outlinedHeading}>{heading}</h1>
      </div>
      <div className="mx-auto mb-40 max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10">
          {folders.map((item, index) => (
            <Folder
              key={index}
              locale={locale}
              slug={item.slug}
              title={item.client}
              description={item.sentence}
              images={item.images}
              buttonLabel={buttonLabel}
              onExpand={() => handleExpand(index)}
            />
          ))}
        </div>
      </div>

      {expandedIndex !== null && folders[expandedIndex] && (
        <div className="fixed inset-0 bg-background z-50 p-8 flex flex-col items-center justify-center">
          <button
            onClick={handleClose}
            className="absolute top-8 right-8 text-foreground"
            aria-label={closeLabel}
          >
            <X size={32} />
          </button>
          <div className="w-full max-w-4xl">
            <Folder
              isExpanded={true}
              locale={locale}
              title={folders[expandedIndex].client}
              description={folders[expandedIndex].sentence}
              images={folders[expandedIndex].images}
              buttonLabel={buttonLabel}
            />
          </div>
          <div className="flex justify-between w-full max-w-5xl mt-4">
            <button
              onClick={handlePrev}
              className="text-foreground flex items-center gap-2"
            >
              <ArrowLeft size={24} /> {prevProjectLabel}
            </button>
            <button
              onClick={handleNext}
              className="text-foreground flex items-center gap-2"
            >
              {nextProjectLabel} <ArrowRight size={24} />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
