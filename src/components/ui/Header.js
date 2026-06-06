export default function Header({ title, level = "h1", variant = "brand" }) {
  const HeadingTag = level;
  const strokeClass =
    variant === "white" ? "text-stroke-white" : "text-stroke-brand";

  return (
    <div className="mb-10 flex justify-center">
      <HeadingTag
        className={`font-monument-extended ${strokeClass} text-4xl md:text-7xl xl:text-5xl uppercase text-center`}
      >
        {title}
      </HeadingTag>
    </div>
  );
}
