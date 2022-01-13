export interface ThesisUpdateDTO {
  id: number;
  authorAlbumNumber: string;
  topic: string;
  keywords?: string;
  summary?: string;
  reviewerId: number | null;
}