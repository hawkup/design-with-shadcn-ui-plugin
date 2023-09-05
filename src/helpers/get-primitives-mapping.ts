import { Primitive, primitiveKeys } from "../themes"

export function getPrimitivesMapping(variableIds: string[]) {
  const primitivesMapping = new Map<Primitive, Set<Variable>>()

  variableIds.forEach((id) => {
    const variable = figma.variables.getVariableById(id)

    if (!variable) {
      throw new Error("Can`t find the variable")
    }

    const variableNames = /color\/([a-z|-]+)\/([0-9]+)/.exec(
      variable.name ?? ""
    )

    if (variableNames) {
      const name = variableNames[1] as Primitive

      if (primitiveKeys.color.includes(name)) {
        const variables = primitivesMapping.get(name) ?? new Set()

        variables.add(variable)

        primitivesMapping.set(name, variables)
      }
    }
  })

  return primitivesMapping
}
