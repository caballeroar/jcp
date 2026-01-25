export default function Header({ title, level = "h1" }) {
  const HeadingTag = level;

  return (
    <div className="mb-10 flex justify-center">
      <HeadingTag className="font-monument-extended text-stroke-brand text-4xl md:text-7xl xl:text-8xl uppercase text-center">
        {title}
      </HeadingTag>
    </div>
  );
}
