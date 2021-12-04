import { createAction, props } from "@ngrx/store";

export const setSelectedThesisId = createAction('[Theses Table] Set Selected Thesis Id', props<{ id: number }>());