type FillableNode =
  | BooleanOperationNode
  | ComponentNode
  | ComponentSetNode
  | EllipseNode
  | FrameNode
  | HighlightNode
  | InstanceNode
  | LineNode
  | PolygonNode
  | RectangleNode
  | SectionNode
  | ShapeWithTextNode
  | StampNode
  | StarNode
  | StickyNode
  | TableNode
  | TextNode
  | VectorNode
  | WashiTapeNode

export function isFillable(node: SceneNode): node is FillableNode {
  if (
    node.type === "BOOLEAN_OPERATION" ||
    node.type === "COMPONENT" ||
    node.type === "COMPONENT_SET" ||
    node.type === "ELLIPSE" ||
    node.type === "FRAME" ||
    node.type === "HIGHLIGHT" ||
    node.type === "INSTANCE" ||
    node.type === "LINE" ||
    node.type === "POLYGON" ||
    node.type === "RECTANGLE" ||
    node.type === "SECTION" ||
    node.type === "SHAPE_WITH_TEXT" ||
    node.type === "STAMP" ||
    node.type === "STAR" ||
    node.type === "STICKY" ||
    node.type === "TABLE" ||
    node.type === "TEXT" ||
    node.type === "VECTOR" ||
    node.type === "WASHI_TAPE"
  ) {
    return true
  }

  return false
}
