export default function Animations() {
  return (
    <style jsx>{`
      .anim-init {
        opacity: 0;
        transform: translateY(12px);
      }
      .stagger-in {
        animation: fadeUp 600ms ease-out forwards;
        opacity: 0;
        transform: translateY(12px);
      }
      .container-pre {
        opacity: 0;
        transform: scaleY(0.85);
        transform-origin: top center;
      }
      #services-brand-area.animate-bg {
        animation: bgGrowDown 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        transform-origin: top center;
      }
      @keyframes fadeUp {
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes bgGrowDown {
        to {
          transform: scaleY(1);
          opacity: 1;
        }
      }
    `}</style>
  );
}
