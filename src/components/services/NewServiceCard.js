import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, X } from "phosphor-react";
import { Button } from "../ui";

const CARD_HEIGHT = "h-[560px] md:h-[620px]";
const NON_ACTIVE_CARD_CLASS = `group relative ${CARD_HEIGHT} flex cursor-pointer flex-col rounded-[34px] border border-white/80 bg-[var(--bg_brand)] px-6 py-8 text-white transition-transform duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg_brand)]`;
const ACTIVE_CARD_CLASS = `${CARD_HEIGHT} relative flex flex-col justify-between rounded-[34px] border border-[var(--content_brand)]/90 bg-white px-4 py-4 text-[var(--content_brand)] shadow-[0_8px_20px_rgba(255,255,255,0.25)]`;

export default function NewServiceCard({ service, isActive, onOpen, onClose }) {
  const {
    methodology = "",
    title = "",
    description = "",
    outcome = "",
    subServices: rawSubServices = [],
  } = service ?? {};
  const subServices = Array.isArray(rawSubServices) ? rawSubServices : [];
  const subServiceCount = subServices.length;

  const [activeSubIndex, setActiveSubIndex] = useState(0);

  useEffect(() => {
    // Reset selected sub-service when active state changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveSubIndex(0);
  }, [isActive]);

  const safeSubIndex =
    subServiceCount > 0 ? activeSubIndex % subServiceCount : 0;
  const activeSubService =
    subServiceCount > 0 ? subServices[safeSubIndex] : null;
  const { title: activeSubTitle = "", description: activeSubDescription = "" } =
    activeSubService ?? {};
  const activeTitle = activeSubTitle || title;
  const activeDescription = activeSubDescription || description;
  const safePackageCount = subServiceCount > 0 ? subServiceCount : 1;
  const safePackageIndex = subServiceCount > 0 ? safeSubIndex + 1 : 1;
  const servicePackageCounter = `${String(safePackageIndex).padStart(2, "0")}/${String(
    safePackageCount,
  ).padStart(2, "0")}`;

  const handleOpen = () => {
    onOpen?.();
  };

  const handleClose = () => {
    onClose?.();
  };

  const handleKeyDown = (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    handleOpen();
  };

  const handlePreviousSubService = () => {
    if (!subServiceCount) return;
    setActiveSubIndex((prev) => (prev - 1 + subServiceCount) % subServiceCount);
  };

  const handleNextSubService = () => {
    if (!subServiceCount) return;
    setActiveSubIndex((prev) => (prev + 1) % subServiceCount);
  };

  const renderCardContent = () => {
    return (
      <div className="mt-8 flex flex-1 flex-col justify-between">
        <div className="mt-16 space-y-7">
          <h3 className="text-[clamp(2rem,3.8vw,2.4rem)] font-bold tracking-tight leading-tight">
            {title}
          </h3>
          <p className="text-[clamp(1rem,3.8vw,1.5rem)] font-normal tracking-tight leading-tight">
            {description}
          </p>
        </div>

        <Button
          onClick={(event) => {
            event.stopPropagation();
            handleOpen();
          }}
          theme="brand"
          className="w-full [&>span]:w-full"
        >
          View Service Package
        </Button>

        {/* <div className="space-y-4">
          <h3 className="max-w-[16ch] text-xl font-roboto-mono font-semibold  tracking-tight">
            Outcome
          </h3>
          <p className="max-w-[30ch] text-lg font-roboto-mono text-white leading-[1.14] mb-6">
            {outcome}
          </p>
        </div> */}
      </div>
    );
  };

  if (isActive) {
    return (
      <article className={ACTIVE_CARD_CLASS}>
        <div className="flex flex-col justify-between ">
          <div className="flex items-center w-full justify-between text-sm font-roboto-mono pl-2">
            <span className="text-[clamp(14px,4vw,18px)]">
              {servicePackageCounter}
            </span>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              iconOnly
              icon={<X size={24} />}
              theme="brand"
              // className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--content_brand)] [&>span]:!h-9 [&>span]:!w-9 [&>span]:!rounded-full [&>span]:!border-black/15 [&>span]:!bg-transparent [&>span]:!text-[#404040] hover:[&>span]:!bg-black/5"
              aria-label="Close service details"
            >
              Close
            </Button>
          </div>

          <div className="mt-4 pl-2 space-y-7 lg:p-4">
            <h3 className="max-w-[16ch] text-[clamp(2rem,3.8vw,2.6rem)] font-bold tracking-tight leading-tight">
              {activeTitle}
            </h3>
            <p className="max-w-[30ch] text-[clamp(1.2rem,4vw,1.4rem)] leading-[1.2]">
              {activeDescription}
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:p-2">
          <div className="space-y-3 pl-2 lg:px-2">
            <h3 className="max-w-[16ch] text-[clamp(16px,4vw,18px)] font-roboto-mono font-semibold  tracking-tight">
              Outcome
            </h3>
            <p className="max-w-[30ch] text-[clamp(14px,4vw,16px)]  font-roboto-mono leading-[1.14] mb-6">
              {outcome}
            </p>
          </div>
          <div className="flex w-full items-center justify-between gap-4">
            <Button
              onClick={handlePreviousSubService}
              iconOnly
              icon={<ArrowLeft size={24} />}
              theme="brand"
              // className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--content_brand)] disabled:pointer-events-none disabled:opacity-50 [&>span]:!h-10 [&>span]:!w-10 [&>span]:!rounded-full [&>span]:!border-[var(--content_brand)] [&>span]:!bg-transparent [&>span]:!text-[var(--content_brand)] hover:[&>span]:!bg-[var(--content_brand)]/10"
              aria-label="Show previous service"
              disabled={!subServiceCount}
            >
              Previous
            </Button>
            <Button
              onClick={handleNextSubService}
              iconOnly
              icon={<ArrowRight size={24} />}
              theme="brand"
              // className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--content_brand)] disabled:pointer-events-none disabled:opacity-50 [&>span]:!h-10 [&>span]:!w-10 [&>span]:!rounded-full [&>span]:!border-[var(--content_brand)] [&>span]:!bg-transparent [&>span]:!text-[var(--content_brand)] hover:[&>span]:!bg-[var(--content_brand)]/10"
              aria-label="Show next service"
              disabled={!subServiceCount}
            >
              Next
            </Button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      onClick={handleOpen}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      className={NON_ACTIVE_CARD_CLASS}
      aria-label={`Open ${title || "service"} details`}
    >
      <div className=" font-roboto-mono text-[clamp(14px,3vw,20px)] tracking-tight">
        <p>{methodology}</p>
        {/* <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/90">
          <ArrowUpRight size={17} weight="bold" />
        </span> */}
      </div>

      {renderCardContent()}
    </article>
  );
}
