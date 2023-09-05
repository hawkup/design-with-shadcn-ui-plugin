type CornerRadiusSettableNode =
  | BooleanOperationNode
  | ComponentNode
  | ComponentSetNode
  | EllipseNode
  | FrameNode
  | HighlightNode
  | InstanceNode
  | PolygonNode
  | RectangleNode
  | StarNode
  | VectorNode

export function isCornerRadiusSettable(
  node: SceneNode
): node is CornerRadiusSettableNode {
  if (
    node.type === "BOOLEAN_OPERATION" ||
    node.type === "COMPONENT" ||
    node.type === "COMPONENT_SET" ||
    node.type === "ELLIPSE" ||
    node.type === "FRAME" ||
    node.type === "HIGHLIGHT" ||
    node.type === "INSTANCE" ||
    node.type === "POLYGON" ||
    node.type === "RECTANGLE" ||
    node.type === "STAR" ||
    node.type === "VECTOR"
  ) {
    return true
  }

  return false
}
