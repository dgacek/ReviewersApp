export interface ThesisUpdateDTO {
  id: number;
  authorName: string;
  authorSurname: string;
  topic: string;
  reviewerId: number | null;
}