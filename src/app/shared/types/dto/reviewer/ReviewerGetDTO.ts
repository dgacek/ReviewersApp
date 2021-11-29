import { DictionaryGetUpdateDTO } from "../dictionary/DictionaryGetUpdateDTO";
import { FacultyGetUpdateDTO } from "../faculty/FacultyGetUpdateDTO";

export interface ReviewerGetDTO {
  id: number;
  name: string;
  surname: string;
  email?: string;
  title: DictionaryGetUpdateDTO;
  faculty: FacultyGetUpdateDTO;
  tags: DictionaryGetUpdateDTO[];
}