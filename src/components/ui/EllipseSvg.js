export default function EllipseSvg({
  rotation,
  index,
  className = "",
  coords = {},
}) {
  const { xStart = 0, yStart = 0, xEnd = 0, yEnd = 0 } = coords;

  return (
    <svg
      className={`ellipse overflow-visible ${className}`}
      data-index={index}
      viewBox="0 0 400 400"
      aria-hidden
      style={{
        "--x-start": `${xStart}px`,
        "--y-start": `${yStart}px`,
        "--x-end": `${xEnd}px`,
        "--y-end": `${yEnd}px`,
      }}
    >
      <ellipse
        cx="200"
        cy="200"
        rx="140"
        ry="320"
        transform={`rotate(${rotation} 200 200)`}
      />
    </svg>
  );
}
