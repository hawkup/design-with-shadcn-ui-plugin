import { primitiveKeys } from "../themes"

type Mode = (typeof primitiveKeys.modes)[number]

export function getModeMapping(
  modes: {
    modeId: string
    name: string
  }[]
) {
  const mappings = new Map<string, Mode>()

  modes.forEach((mode) => {
    const modeName = mode.name.toLowerCase() as Mode
    if (primitiveKeys.modes.includes(modeName)) {
      mappings.set(mode.modeId, modeName)
    }
  })

  return mappings
}
