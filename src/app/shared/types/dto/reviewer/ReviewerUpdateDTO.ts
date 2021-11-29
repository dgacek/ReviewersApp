export interface ReviewerUpdateDTO {
  id: number;
  name: string;
  surname: string;
  email?: string;
  titleId: number;
  facultyId: number;
  tagIdList: number[];
}