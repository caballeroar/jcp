// Non-localized image registry for case folders
// Map slug -> array of image paths (under public/assets)

export const CASE_IMAGES = {
  "case-1": [
    "/assets/E6_Repair_Coalition_1.webp",
    "/assets/E6_Repair_Coalition_2.webp",
    "/assets/E6_Repair_Coalition_3.webp",
    "/assets/E6_Repair_Coalition_4.webp",
  ],
  "case-2": [
    "/assets/IMG_3394.PNG",
    "/assets/i_0.d21c62ce.jpg",
    "/assets/053ddcc1121fc6adc27be3f9d992186f.jpg",
    "/assets/ddd.jpg",
  ],
  "case-3": [
    "/assets/i_0.d21c62ce.jpg",
    "/assets/053ddcc1121fc6adc27be3f9d992186f.jpg",
    "/assets/ddd.jpg",
    "/assets/IMG_3394.PNG",
  ],
  "case-4": [
    "/assets/053ddcc1121fc6adc27be3f9d992186f.jpg",
    "/assets/IMG_3394.PNG",
    "/assets/i_0.d21c62ce.jpg",
    "/assets/ddd.jpg",
  ],
};

export function getCaseImages(slug) {
  return CASE_IMAGES[slug] || [];
}

export const CASES = [
  {
    slug: "case-1",
    title: "E6 Repair Coalition",
    challenge:
      "The municipality needed insight into the fragmented electronic repair sector and support in building a coalition around repair, circular economy and local collaboration.",
    solution:
      "JCP conducted a deep sector analysis, mapped repair actors across The Hague, identified strategic coalition partners, and developed an approach for organising and activating the sector. This included stakeholder sessions, mobilisation strategies and coalition building around shared ambitions for repair and circularity.",
    description:
      "As part of a European circular economy trajectory, JCP supported the development of a local repair ecosystem focused on electronic and household device repair. The project combined research, stakeholder engagement and coalition building to strengthen collaboration between repair shops, educational institutions, community initiatives and public actors. By translating a fragmented landscape into a shared network and direction, the project helped lay the foundation for a more visible, accessible and future proof repair sector in The Hague.",
    themes: [
      "circular economy",
      "coalition building",
      "Stakeholder engagement",
      "Ecosystem mapping",
      "Soft infrastructure",
    ],
    services: [
      "Coalition building and network facilitation",
      "Ecosystem mapping and analysis",
      "Stakeholder engagement and mobilisation",
      "Strategy development for circular economy activation",
    ],
  },
  {
    slug: "case-2",
    title: "VORM – Social Impact Tender Assistance",
    challenge:
      "VORM needed support in strengthening the social impact component of a tender for a large scale housing development project. The challenge was to move beyond standard participation and develop a strategy for long term community ownership and social cohesion.",
    solution:
      "JCP conducted interviews and community research to understand local needs, tensions and opportunities. Based on these insights, JCP developed a strategy focused on community building, shared ownership and the creation of a resident driven cooperative structure connected to the future development.",
    description:
      "For this large-scale housing development, JCP helped translate social impact ambitions into a practical and community-rooted strategy. Through interviews, stakeholder engagement and contextual analysis, the project explored how future and existing residents could play a meaningful role in shaping the neighbourhood. The resulting strategy focused on bottom up ownership, collective infrastructure and long term social cohesion, helping strengthen the tender’s social impact proposition.",
    themes: [
      "Community building",
      "Social impact",
      "Participation",
      "Collective ownership",
      "Neighbourhood resilience",
    ],

    services: [
      "Participation and community building",
      "Placemaking and civic infrastructure",
      "Strategy and systems change",
    ],
  },
];
