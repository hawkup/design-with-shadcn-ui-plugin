export function isSolidPaints(
  paints: readonly Paint[] | PluginAPI["mixed"]
): paints is SolidPaint[] {
  if (paints !== figma.mixed && paints.length && paints[0].type === "SOLID") {
    return true
  }

  return false
}
