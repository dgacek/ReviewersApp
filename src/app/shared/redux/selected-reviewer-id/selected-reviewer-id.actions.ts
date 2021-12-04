import { createAction, props } from "@ngrx/store";

export const setSelectedReviewerId = createAction('[Reviewers Table] Set Selected Reviewer Id', props<{ id: number }>());