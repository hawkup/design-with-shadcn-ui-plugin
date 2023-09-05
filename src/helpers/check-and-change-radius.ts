import { Radius, TokenRadius, radii } from "../themes"
import { isCornerRadiusSettable } from "./is-corner-radius-settable"

export function checkAndChangeRadius(node: SceneNode, radius: Radius) {
  if (
    isCornerRadiusSettable(node) &&
    node.boundVariables &&
    node.boundVariables.topRightRadius
  ) {
    if ("id" in node.boundVariables.topRightRadius) {
      const variable = figma.variables.getVariableById(
        node.boundVariables.topRightRadius.id
      )

      if (!variable) {
        throw new Error("Can`t find the variable")
      }

      const variableNames = /radius\/([a-z|-]+)/.exec(variable.name ?? "")

      if (variableNames) {
        const name = variableNames[1] as TokenRadius

        node.cornerRadius = radii[radius][name]
      }
    }
  }
}
