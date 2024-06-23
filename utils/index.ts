export function clamp(value: number, min: number, max: number | null = null) {
  let ret = Math.max(value, min);
  if (max != null) {
    max = Math.max(max - 1, 0); // Exclude last
    ret = Math.min(ret, max);
  }
  return ret;
}
