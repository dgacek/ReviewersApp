import { ReviewerGetDTO } from "../reviewer/ReviewerGetDTO";

export interface ThesisGetDTO {
  id: number;
  authorAlbumNumber: string;
  topic: string;
  reviewer: ReviewerGetDTO;
}