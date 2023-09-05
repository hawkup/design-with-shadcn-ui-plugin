import { convertHexColorToRgbColor } from "@create-figma-plugin/utilities"
import { Color, Mode, Primitive, colors, primitiveKeys } from "../themes"
import { getDeepestNodeVariable } from "./get-deepest-node-variable"
import { isSolidPaints } from "./is-solid-paints"
import { isStrokeable } from "./is-strokeable"

export function checkAndChangeStrokes(
  node: SceneNode,
  color: Color,
  mode: Mode
) {
  if (isStrokeable(node) && isSolidPaints(node.strokes)) {
    const boundVariables = node.strokes[0].boundVariables
    const variableId = boundVariables?.color?.id ?? ""

    // No id
    if (!variableId) return

    const variable = figma.variables.getVariableById(variableId)

    if (!variable) {
      throw new Error("Can`t find the variable")
    }

    const [deepestVariable, modeId] = getDeepestNodeVariable(node, variable)

    const variableNames = /color\/([a-z|-]+)\/([0-9]+)/.exec(
      deepestVariable.name ?? ""
    )

    if (variableNames) {
      const name = variableNames[1] as Primitive

      if (primitiveKeys.color.includes(name)) {
        const collection = figma.variables.getVariableCollectionById(
          deepestVariable.variableCollectionId
        )

        if (!collection) {
          throw new Error("Can`t find the collection")
        }

        const colorHex = colors[color][mode][name]
        const rgba = {
          ...convertHexColorToRgbColor(colorHex),
          a: (deepestVariable.valuesByMode[modeId] as RGBA).a,
        } as RGBA

        node.strokes = [figma.util.solidPaint(rgba)]
      }
    }
  }
}
