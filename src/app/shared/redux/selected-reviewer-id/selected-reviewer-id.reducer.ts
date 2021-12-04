import { createReducer, Action, on } from "@ngrx/store";
import { setSelectedReviewerId } from "./selected-reviewer-id.actions";

export const initialState = 0;

const _selectedReviewerIdReducer = createReducer(
  initialState,
  on(setSelectedReviewerId, (state, { id }) => id)
);

export function selectedReviewerIdReducer(state: number | undefined, action: Action) {
  return _selectedReviewerIdReducer(state, action);
}