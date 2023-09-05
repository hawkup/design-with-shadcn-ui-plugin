import { TokenRadius, primitiveKeys } from "../themes"

export function getTokensMapping(variableIds: string[]) {
  const tokensMapping = new Map<TokenRadius, Set<Variable>>()

  variableIds.forEach((id) => {
    const variable = figma.variables.getVariableById(id)

    if (!variable) {
      throw new Error("Can`t find the variable")
    }

    const variableNames = /radius\/([a-z|-]+)/.exec(variable.name ?? "")

    if (variableNames) {
      const name = variableNames[1] as TokenRadius

      if (primitiveKeys.radius.includes(name)) {
        const variables = tokensMapping.get(name) ?? new Set()

        variables.add(variable)

        tokensMapping.set(name, variables)
      }
    }
  })

  return tokensMapping
}
