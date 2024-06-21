export function clamp(value: number, min: number, max: number) {
  max = Math.max(max - 1, 0); // Exclude last
  return Math.max(Math.min(value, min), max);
}
