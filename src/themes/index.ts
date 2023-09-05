import { blue } from "./colors/blue"
import { gray } from "./colors/gray"
import { green } from "./colors/green"
import { neutral } from "./colors/neutral"
import { orange } from "./colors/orange"
import { red } from "./colors/red"
import { rose } from "./colors/rose"
import { slate } from "./colors/slate"
import { stone } from "./colors/stone"
import { violet } from "./colors/violet"
import { yellow } from "./colors/yellow"
import { zinc } from "./colors/zinc"

import { radius0 } from "./radii/radius-0"
import { radius03 } from "./radii/radius-0.3"
import { radius05 } from "./radii/radius-0.5"
import { radius075 } from "./radii/radius-0.75"
import { radius1 } from "./radii/radius-1.0"

export type Color = keyof typeof colors
export type Radius = keyof typeof radii
export type Primitive = (typeof primitiveKeys.color)[number]
export type TokenRadius = (typeof primitiveKeys.radius)[number]
export type Mode = (typeof modes)[number]

export const primitiveKeys = {
  modes: ["light", "dark"],
  color: [
    "background",
    "foreground",
    "card",
    "card-foreground",
    "popover",
    "popover-foreground",
    "primary",
    "primary-foreground",
    "secondary",
    "secondary-foreground",
    "muted",
    "muted-foreground",
    "accent",
    "accent-foreground",
    "destructive",
    "destructive-foreground",
    "border",
    "input",
    "ring",
  ],
  radius: [
    "rounded-sm",
    "rounded-md",
    "rounded-lg",
    "rounded-xl",
    "rounded-full",
  ],
} as const

export const colors = {
  zinc,
  slate,
  stone,
  gray,
  neutral,
  red,
  rose,
  orange,
  green,
  blue,
  yellow,
  violet,
}

export const radii = {
  "0": radius0,
  "0.3": radius03,
  "0.5": radius05,
  "0.75": radius075,
  "1.0": radius1,
}

export const modes = ["light", "dark"] as const
