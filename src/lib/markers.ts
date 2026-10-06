export type MarkerState = {
  expandedId: string | null
  selectedId: string | null
}

export type MarkerAction =
  | { type: "select"; id: string }
  | { type: "expand"; id: string }
  | { type: "collapse" }
  | { type: "deselect" }
  | { type: "hover-card"; id: string | null }

/** Single expanded marker; selection shared with list highlight. */
export function markerReducer(
  state: MarkerState,
  action: MarkerAction,
): MarkerState {
  switch (action.type) {
    case "expand":
      return { expandedId: action.id, selectedId: action.id }
    case "select":
      return {
        expandedId: state.expandedId === action.id ? state.expandedId : null,
        selectedId: action.id,
      }
    case "hover-card":
      return {
        ...state,
        selectedId: action.id ?? state.expandedId,
      }
    case "collapse":
      return { ...state, expandedId: null }
    case "deselect":
      return { expandedId: null, selectedId: null }
    default:
      return state
  }
}

export const initialMarkerState: MarkerState = {
  expandedId: null,
  selectedId: null,
}

/** Keep MapLibre's positioning classes when the pin opens or closes. */
export function markerElementClass(
  current: string,
  type: string,
  selected: boolean,
  expanded: boolean,
) {
  const lib = current.split(/\s+/).filter((name) => name.startsWith("maplibregl-"))
  const own = ["map-pin", `is-${type}`]
  if (selected) own.push("is-selected")
  if (expanded) own.push("is-open")
  return [...own, ...lib].join(" ")
}
