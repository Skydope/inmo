export type MarkerState = {
  expandedId: string | null
  selectedId: string | null
}

export type MarkerAction =
  | { type: "select"; id: string }
  | { type: "expand"; id: string }
  | { type: "collapse" }
  | { type: "hover-card"; id: string | null }
  | { type: "clear" }

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
    case "clear":
      return { expandedId: null, selectedId: null }
    default:
      return state
  }
}

export const initialMarkerState: MarkerState = {
  expandedId: null,
  selectedId: null,
}
