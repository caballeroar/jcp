import Image from "next/image";

export default function ServiceCard({ service, expanded, dimmed, onClick }) {
  return (
    <article
      onClick={onClick}
      className="rounded-xl border-[2px] border-white bg-[var(--bg_brand)] text-white flex flex-col items-center justify-between gap-6 pt-10 pb-6 px-4 h-[440px] cursor-pointer transition-all duration-300 ease-out hover:bg-white/10 hover:scale-[1.02]"
    >
      {!expanded ? (
        <>
          {service.svg ? (
            <div className="flex w-full h-full justify-center pt-8">
              <Image
                src={service.svg}
                alt={service.title ?? "Service"}
                width={160}
                height={160}
                className={`object-contain max-h-40 brightness-0 invert transition-transform duration-300 ${dimmed}`}
              />
            </div>
          ) : (
            <div className="h-40 w-full flex items-center justify-center text-sm uppercase font-roboto-mono opacity-60">
              {service.title}
            </div>
          )}
          <h3 className="text-sm md:text-base font-roboto-mono uppercase text-center">
            {service.title}
          </h3>
        </>
      ) : (
        <>
          <div className="flex w-full h-full justify-center pt-8">
            <p className="text-2xl text-center px-4 leading-1.2">
              {service.description}
            </p>
          </div>
          <h3 className="text-base font-roboto-mono uppercase text-center">
            {service.title}
          </h3>
        </>
      )}
    </article>
  );
}
