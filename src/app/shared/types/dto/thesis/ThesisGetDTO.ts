import { ReviewerGetDTO } from "../reviewer/ReviewerGetDTO";

export interface ThesisGetDTO {
  id: number;
  authorName: string;
  authorSurname: string;
  topic: string;
  reviewer: ReviewerGetDTO;
}