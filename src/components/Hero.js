"use client";

export default function Hero() {
  const accent =
    "text-xl md:text-4xl font-bold mb-2 text-[var(--content_brand)]";

  return (
    <section className="min-h-screen flex items-center justify-center px-6 relative z-10">
      <div className="w-full text-center px-8 sm:px-12 md:px-24 lg:px-40 xl:px-64">
        <h1 className="text-xl md:text-4xl font-semibold text-foreground leading-tight">
          Your <span className={accent}>sustainability</span> and{" "}
          <span className={accent}>justice</span> challenges deserve human
          centered insight and action.
        </h1>
      </div>
    </section>
  );
}
