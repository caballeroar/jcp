export default function Header({ title }) {
  return (
    <div className="mb-10 flex justify-center">
      <h2 className="font-monument-extended text-stroke-brand text-8xl md:text-9xl">
        {title}
      </h2>
    </div>
  );
}
