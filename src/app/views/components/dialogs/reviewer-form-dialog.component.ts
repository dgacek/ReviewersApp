import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DictionaryService } from 'src/app/services/rest/dictionary.service';
import { FacultyService } from 'src/app/services/rest/faculty.service';
import { ReviewerService } from 'src/app/services/rest/reviewer.service';

@Component({
  selector: 'app-reviewer-form-dialog',
  styles: [`

  `],
  template: `
    <h1 mat-dialog-title >
  `
})
export class ReviewerFormDialogComponent implements OnInit {

  constructor(private reviewerService: ReviewerService,
    private facultyService: FacultyService,
    private dictionaryService: DictionaryService,
    private dialogRef: MatDialogRef<ReviewerFormDialogComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) readonly editId?: number) { }

  ngOnInit(): void {
  }

}
