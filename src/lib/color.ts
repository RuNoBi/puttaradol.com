import { Vector3 } from "three";

/**
 * Hex → raw sRGB vector for custom shaders. (three's `Color` converts to
 * linear space, but our ShaderMaterials output raw sRGB, so colours would
 * come out darker than the CSS tokens.)
 */
export function srgb(hex: string) {
  const n = parseInt(hex.replace("#", ""), 16);
  return new Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}
