import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DictionaryService } from 'src/app/services/rest/dictionary.service';
import { FacultyService } from 'src/app/services/rest/faculty.service';
import { ReviewerService } from 'src/app/services/rest/reviewer.service';
import { DictionaryGetUpdateDTO } from 'src/app/shared/types/dto/dictionary/DictionaryGetUpdateDTO';
import { FacultyGetUpdateDTO } from 'src/app/shared/types/dto/faculty/FacultyGetUpdateDTO';

@Component({
  selector: 'app-reviewer-form-dialog',
  styles: [`

  `],
  template: `
    <h1 mat-dialog-title *ngIf="!editId">Add reviewer</h1>
    <h1 mat-dialog-title *ngIf="editId">Edit reviewer</h1>
  `
})
export class ReviewerFormDialogComponent implements OnInit {

  titles: DictionaryGetUpdateDTO[] = [];
  tags: DictionaryGetUpdateDTO[] = [];
  faculties: FacultyGetUpdateDTO[] = [];

  selectedTitleId?: number;
  selectedFacultyId?: number;
  selectedTagIds: number[] = [];

  constructor(private reviewerService: ReviewerService,
    private facultyService: FacultyService,
    private dictionaryService: DictionaryService,
    private dialogRef: MatDialogRef<ReviewerFormDialogComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) readonly editId?: number) { }

  ngOnInit(): void {
    this.updateTitleList();
    this.updateFacultyList();
    this.updateTagList();
  }

  updateTitleList(): void {
    this.dictionaryService.get("title").subscribe(
      {
        next: (response) => {
          this.titles = response;
        }
      }
    );
  }

  updateFacultyList(): void {
    this.facultyService.get().subscribe(
      {
        next: (response) => {
          this.faculties = response;
        }
      }
    );
  }

  updateTagList(): void {
    this.dictionaryService.get("tag").subscribe(
      {
        next: (response) => {
          this.tags = response;
        }
      }
    );
  }

  openFacultyFormDialog(): void {
    
  }

}
