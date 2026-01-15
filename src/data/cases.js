// Non-localized image registry for case folders
// Map slug -> array of image paths (under public/assets)

export const CASE_IMAGES = {
  "case-1": [
    "/assets/053ddcc1121fc6adc27be3f9d992186f.jpg",
    "/assets/IMG_3394.PNG",
    "/assets/i_0.d21c62ce.jpg",
    "/assets/ddd.jpg",
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
