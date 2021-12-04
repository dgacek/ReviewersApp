import { Action, createReducer, on } from "@ngrx/store";
import { setSelectedThesisId } from "./selected-thesis-id.actions";

export const initialState = 0;

const _selectedThesisIdReducer = createReducer(
  initialState,
  on(setSelectedThesisId, (state, { id }) => id)
);

export function selectedThesisIdReducer(state: number | undefined, action: Action) {
  return _selectedThesisIdReducer(state, action);
}