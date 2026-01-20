export default function EllipseSvg({ rotation, index, className }) {
  return (
    <svg
      className={`ellipse overflow-visible ${className}`}
      data-index={index}
      viewBox="0 0 400 400"
      aria-hidden
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
