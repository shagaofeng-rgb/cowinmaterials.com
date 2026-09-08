type EditorialImageFamily = "aerogel" | "battery" | "fire" | "water";

export type EditorialNewsImage = {
  url: string;
  alt: string;
  family: EditorialImageFamily;
};

const editorialImages: Record<EditorialImageFamily, readonly Omit<EditorialNewsImage, "family">[]> = {
  aerogel: [
    { url: "/images/news/aerogel-insulation-editorial.jpg", alt: "Editorial illustration of silica aerogel granules and an insulation blanket cross-section." },
    { url: "/images/news/aerogel-insulation-editorial-2.jpg", alt: "Editorial illustration of an insulated industrial pipe with an aerogel blanket layer." },
  ],
  battery: [
    { url: "/images/news/battery-thermal-barrier-editorial.jpg", alt: "Editorial illustration of a battery module with a thermal barrier layer." },
    { url: "/images/news/battery-thermal-barrier-editorial-2.jpg", alt: "Editorial illustration of stacked battery modules separated by aerogel barrier sheets." },
  ],
  fire: [
    { url: "/images/news/fire-protection-editorial.jpg", alt: "Editorial illustration of a protected steel section and a developed coating layer." },
    { url: "/images/news/fire-protection-editorial-2.jpg", alt: "Editorial illustration of a coated structural-steel assembly for passive fire-protection context." },
  ],
  water: [
    { url: "/images/news/water-repellent-editorial.jpg", alt: "Editorial illustration of water beading on a mineral substrate." },
    { url: "/images/news/water-repellent-editorial-2.jpg", alt: "Editorial illustration of rainwater shedding from an architectural concrete surface." },
  ],
};

function selectFamily(text: string): EditorialImageFamily {
  if (/\b(waterproof|water repellent|water repellency|hydrophobic|concrete|masonry|silane|siloxane|penetrating)\b/i.test(text)) return "water";
  if (/\b(battery|batteries|cell|pack|electric vehicle|\bev\b|lithium|bess|thermal runaway)\b/i.test(text)) return "battery";
  if (/\b(intumescent|fireproof|fire protection|passive fire|steel fire|fire safety)\b/i.test(text)) return "fire";
  return "aerogel";
}

function stableIndex(value: string, length: number) {
  let total = 0;
  for (let index = 0; index < value.length; index += 1) total = (total * 31 + value.charCodeAt(index)) >>> 0;
  return total % length;
}

/**
 * Keeps a story on the same cover across rebuilds while distributing each
 * material topic across two appropriate editorial illustrations.
 */
export function getEditorialNewsImage({ title, summary = "", seed = title }: { title: string; summary?: string; seed?: string }): EditorialNewsImage {
  const family = selectFamily(`${title} ${summary}`);
  const image = editorialImages[family][stableIndex(seed, editorialImages[family].length)];
  return { ...image, family };
}
