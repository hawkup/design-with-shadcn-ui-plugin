import { EventHandler } from "@create-figma-plugin/utilities"
import { Color, Mode, Radius } from "./themes"

export interface ResizeWindowHandler extends EventHandler {
  name: "RESIZE_WINDOW"
  handler: (windowSize: { width: number; height: number }) => void
}

export interface ChangeSelectionThemeHandler extends EventHandler {
  name: "CHANGE_SELECTION_THEME"
  handler: (
    color: Color | null,
    radius: Radius | null,
    mode: Mode | null
  ) => void
}

export interface ChangeVariablesThemeHandler extends EventHandler {
  name: "CHANGE_VARIABLES_THEME"
  handler: (color: Color | null, radius: Radius | null) => void
}
