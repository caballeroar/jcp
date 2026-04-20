"use client";

import FolderIcon from "../../../components/ui/Folder/Folder";
import { useCaseModal } from "../../../hooks/useCaseModal";
import CasesModal from "../../../components/CasesModal";
import Image from "next/image";
import Logo from "../../../../public/assets/logo_icon.svg";

export default function CasesClientPage({
  heading,
  folders = [],
  locale,
  initialCaseSlug = null,
}) {
  const initialCaseIndex = folders.findIndex(
    (item) => item?.slug === initialCaseSlug,
  );
  const {
    expandedIndex,
    activeCase,
    isOpen,
    totalCases,
    openCase,
    closeCase,
    cycleCase,
  } = useCaseModal(folders, initialCaseIndex >= 0 ? initialCaseIndex : null);

  return (
    <section className="relative min-h-screen bg-background text-foreground px-6 py-20">
      <Image src={Logo} alt="Logo" fill className="object-cover opacity-10" />
      <div className="mx-auto max-w-6xl space-y-12">
        <h1 className="my-[14%] text-center uppercase font-monument-extended text-stroke-brand text-6xl md:text-8xl tracking-tight">
          {heading}
        </h1>

        <div className="grid grid-cols-1 gap-8 my-[14%] md:grid-cols-2">
          {folders.map((item, index) => (
            <FolderIcon
              key={item.slug}
              title={item.client}
              description={item.sentence}
              images={item.images}
              cta={item.cta}
              onExpand={() => openCase(index)}
            />
          ))}
        </div>
      </div>

      {isOpen && (
        <CasesModal
          isOpen={isOpen}
          activeCase={activeCase}
          expandedIndex={expandedIndex}
          totalCases={totalCases}
          cases={folders}
          onClose={closeCase}
          onPrev={() => cycleCase(-1)}
          onNext={() => cycleCase(1)}
          onSelectCase={openCase}
          locale={locale}
        />
      )}
    </section>
  );
}
