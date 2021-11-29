export interface ReviewerAddDTO {
  name: string;
  surname: string;
  email?: string;
  titleId: number;
  facultyId: number;
  tagIdList: number[];
}