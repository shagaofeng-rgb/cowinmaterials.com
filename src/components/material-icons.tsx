import { createLucideIcon, Droplets, Flame } from "lucide-react";
import type { LucideProps } from "lucide-react";

const AerogelParticles = createLucideIcon("aerogel-particles", [
  ["circle", { cx: "5", cy: "14", r: "2", key: "left" }],
  ["circle", { cx: "12", cy: "9", r: "3", key: "center" }],
  ["circle", { cx: "19", cy: "14", r: "2", key: "right" }],
  ["circle", { cx: "11", cy: "19", r: "2", key: "bottom" }],
  ["circle", { cx: "18.5", cy: "4.5", r: "1.5", key: "top" }],
]);

const AerogelBlanket = createLucideIcon("aerogel-blanket", [
  ["path", { d: "m3 8 9-5 9 5-9 5-9-5Z", key: "top" }],
  ["path", { d: "m3 12 9 5 9-5m-18 4 9 5 9-5", key: "layers" }],
]);

const CoatingLayers = createLucideIcon("coating-layers", [
  ["path", { d: "m4 12 13-8 4 5-7 4-10-1ZM3 17h18M5 21h14", key: "coating" }],
]);

const ProtectiveSystems = createLucideIcon("protective-systems", [
  ["path", { d: "M12 22s7-3.5 7-9V5l-7-3-7 3v8c0 5.5 7 9 7 9Z", key: "shield" }],
  ["path", { d: "m9 12 2 2 4-4", key: "mark" }],
]);

const icons = {
  powder: AerogelParticles,
  blanket: AerogelBlanket,
  coating: CoatingLayers,
  protection: ProtectiveSystems,
  fire: Flame,
  water: Droplets,
};

export type MaterialIconName = keyof typeof icons;

export function MaterialIcon({ name, ...props }: LucideProps & { name: MaterialIconName }) {
  const Icon = icons[name];
  return <Icon aria-hidden="true" {...props} />;
}
