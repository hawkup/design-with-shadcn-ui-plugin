import {
  convertHexColorToRgbColor,
  on,
  showUI,
} from "@create-figma-plugin/utilities"

import {
  ChangeVariablesThemeHandler,
  ChangeSelectionThemeHandler,
} from "./types"

import { primitiveKeys, colors, radii, Color, Radius, Mode } from "./themes"
import { getPrimitivesMapping } from "./helpers/get-primitives-mapping"
import { getModeMapping } from "./helpers/get-mode-mapping"
import { getTokensMapping } from "./helpers/get-tokens-mapping"
import { checkAndChangeFills } from "./helpers/check-and-change-fills"
import { checkAndChangeStrokes } from "./helpers/check-and-change-strokes"
import { checkAndChangeRadius } from "./helpers/check-and-change-radius"

const PRIMITIVES_COLLECTION_NAME = "Primitives"
const TOKEN_COLLECTION_NAME = "Tokens"

export default function () {
  on<ChangeVariablesThemeHandler>(
    "CHANGE_VARIABLES_THEME",
    changeVariablesTheme
  ),
    on<ChangeSelectionThemeHandler>(
      "CHANGE_SELECTION_THEME",
      changeSelectionTheme
    ),
    showUI({
      height: 540,
      width: 340,
    })
}

function changeVariablesTheme(
  color: Color | null,
  radius: Radius | null,
  numberOfSupportedModes?: number
) {
  try {
    if (!color) {
      figma.notify("Please choose a color.")
      return
    }

    if (!radius) {
      figma.notify("Please choose a radius.")
      return
    }

    const collections = figma.variables.getLocalVariableCollections()

    const primitivesCollection = collections.find(
      (collection) => collection.name === PRIMITIVES_COLLECTION_NAME
    )
    const tokensCollection = collections.find(
      (collection) => collection.name === TOKEN_COLLECTION_NAME
    )

    if (!primitivesCollection && !tokensCollection) {
      figma.notify(
        'This action does not support outside of Design with shadcn/ui. Please try "Apply to selection"',
        {
          error: true,
        }
      )
      return
    }

    if (!primitivesCollection) {
      figma.notify("No `Primitives` collection found. Please check.", {
        error: true,
      })
      return
    }

    if (!tokensCollection) {
      figma.notify("No `Tokens` collection found. Please check.", {
        error: true,
      })
      return
    }

    const modes = primitivesCollection.modes

    const primitivesMapping = getPrimitivesMapping(
      primitivesCollection.variableIds
    )

    const differencePrimitives = primitiveKeys.color.filter(
      (key) => !primitivesMapping.has(key)
    )

    if (differencePrimitives.length) {
      figma.notify(
        "Please check the variables in the Primitives collection. They may be missing.",
        {
          error: true,
        }
      )
      return
    }

    const differenceModes = primitiveKeys.modes.filter(
      (key) => !modes.find((m) => m.name.toLowerCase() === key.toLowerCase())
    )

    if (differenceModes.length) {
      figma.notify(
        "Please check the modes in the Primitives collection. They may be missing.",
        {
          error: true,
        }
      )
      return
    }

    const tokensRadiusMapping = getTokensMapping(tokensCollection.variableIds)

    const differenceTokens = primitiveKeys.radius.filter(
      (key) => !tokensRadiusMapping.has(key)
    )

    if (differenceTokens.length) {
      figma.notify(
        "Please check the variables in the Tokens collection. They may be missing.",
        {
          error: true,
        }
      )
      return
    }

    // Radius
    for (const [name, variables] of tokensRadiusMapping) {
      variables.forEach((variable) => {
        let valuesByMode: [string, VariableValue][] = []

        if (numberOfSupportedModes === undefined) {
          // Reverse the order of items and perform actions from the end
          valuesByMode = Object.entries(variable?.valuesByMode).reverse()
        } else if (numberOfSupportedModes > 0) {
          valuesByMode = Object.entries(variable?.valuesByMode).slice(
            0,
            numberOfSupportedModes
          )
        }

        valuesByMode.forEach(([modeId, variableValue]) => {
          if (radii[radius] && name in radii[radius]) {
            const radiusValue = radii[radius][name]
            variable.setValueForMode(modeId, radiusValue)
          }
        })
      })
    }

    // Color
    for (const [primitiveName, variables] of primitivesMapping) {
      variables.forEach((variable) => {
        let valuesByMode: [string, VariableValue][] = []

        if (numberOfSupportedModes === undefined) {
          // Reverse the order of items and perform actions from the end
          valuesByMode = Object.entries(variable?.valuesByMode).reverse()
        } else if (numberOfSupportedModes > 0) {
          valuesByMode = Object.entries(variable?.valuesByMode).slice(
            0,
            numberOfSupportedModes
          )
        }

        valuesByMode.forEach(([modeId, variableValue]) => {
          const modeName = getModeMapping(modes).get(modeId)

          if (
            modeName &&
            colors[color] &&
            colors[color][modeName] &&
            colors[color][modeName][primitiveName]
          ) {
            const colorHex = colors[color][modeName][primitiveName]
            const rgba = {
              ...convertHexColorToRgbColor(colorHex),
              a: (variableValue as RGBA).a,
            } as RGBA
            variable.setValueForMode(modeId, rgba)
          }
        })
      })
    }

    figma.notify(
      "Applied theme to variables. Please wait a moment for the components to take effect."
    )
  } catch (e) {
    if (e instanceof Error) {
      const match =
        /in setValueForMode: cannot modify modes beyond limit of (\d+)/.exec(
          e.message
        )

      if (match?.[1]) {
        const numberOfSupportedModes = Number(match[1])

        const notifyHandler = figma.notify(
          `Your current plan only supports ${numberOfSupportedModes} mode(s).`,
          {
            button: {
              text: `Click to proceed with ${numberOfSupportedModes} mode(s)`,
              action: () => {
                changeVariablesTheme(color, radius, numberOfSupportedModes)

                notifyHandler.cancel()

                return false
              },
            },
          }
        )
      } else {
        figma.notify(e.message, { error: true })
      }
    }
  }
}

function changeSelectionTheme(
  color: Color | null,
  radius: Radius | null,
  mode: Mode | null
) {
  const selection = figma.currentPage.selection

  if (!selection.length) {
    figma.notify("Please select a node.")
    return
  }

  if (!color) {
    figma.notify("Please choose a color.")
    return
  }

  if (!radius) {
    figma.notify("Please choose a radius.")
    return
  }

  if (!mode) {
    figma.notify("Please choose a mode.")
    return
  }

  selection.forEach((node) => {
    changeThemeNodeRecursion(node, color, radius, mode)
  })

  figma.notify("Applied theme to the selection.")
}

function changeThemeNodeRecursion(
  node: SceneNode,
  color: Color,
  radius: Radius,
  mode: Mode
) {
  changeThemeNode(node, color, radius, mode)
  if ("children" in node && node.children.length) {
    node.children.forEach((n) => {
      changeThemeNodeRecursion(n, color, radius, mode)
    })
  }
}

function changeThemeNode(
  node: SceneNode,
  color: Color,
  radius: Radius,
  mode: Mode
) {
  if (node.boundVariables) {
    Object.entries(node.boundVariables).forEach(([type, boundVariable]) => {
      if (Array.isArray(boundVariable)) {
        checkAndChangeFills(node, color, mode)

        checkAndChangeStrokes(node, color, mode)
      } else if (
        typeof boundVariable === "object" &&
        typeof boundVariable.id === "string"
      ) {
        checkAndChangeRadius(node, radius)
      }
    })
  }
}
