export function getDeepestNodeVariable(
  node: SceneNode,
  variable: Variable
): [Variable, string] {
  const modeId = node.resolvedVariableModes[variable.variableCollectionId]
  const variableValue = variable.valuesByMode[modeId]

  if (typeof variableValue === "object" && "id" in variableValue) {
    const variable = figma.variables.getVariableById(variableValue.id)

    if (!variable) {
      throw new Error("Can`t find the variable")
    }

    return getDeepestNodeVariable(node, variable)
  }

  return [variable, modeId]
}
