"use client";

export default function BackgroundAnimation({ locale }) {
  const words = {
    en: ["Identify", "Listen", "Translate", "Experience"],
    nl: ["Ontdekken", "Luisteren", "Vertalen", "Ervaren"],
  };

  const currentWords = words[locale] || words.en;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-40">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full flex items-center justify-center animate-spin-slow">
          <svg
            width="120vmin"
            height="120vmin"
            className="absolute text-foreground/20"
            viewBox="0 0 1000 1000"
          >
            <circle
              cx="500"
              cy="500"
              r="400"
              fill="none"
              stroke="#DF4D20"
              strokeWidth="2"
              strokeDasharray="8 8"
            />

            {/* Curved text paths - positioned further from circle */}
            <defs>
              <path
                id="circle-path-1"
                d="M 500 70 A 430 430 0 0 1 930 500"
                fill="none"
              />
              <path
                id="circle-path-2"
                d="M 930 500 A 430 430 0 0 1 500 930"
                fill="none"
              />
              <path
                id="circle-path-3"
                d="M 500 930 A 430 430 0 0 1 70 500"
                fill="none"
              />
              <path
                id="circle-path-4"
                d="M 70 500 A 430 430 0 0 1 500 70"
                fill="none"
              />
            </defs>

            {/* Text on curved paths */}
            {currentWords.map((word, index) => (
              <text
                key={word}
                className="text-foreground/30 font-light fill-current"
                fontSize="20"
              >
                <textPath
                  href={`#circle-path-${index + 1}`}
                  startOffset="40%"
                  textAnchor="middle"
                >
                  {word}
                </textPath>
              </text>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}
