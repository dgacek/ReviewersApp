export interface ReviewerUpdateDTO {
  id: number;
  name: string;
  surname: string;
  titleId: number;
  facultyId: number;
  tagIdList: number[];
}