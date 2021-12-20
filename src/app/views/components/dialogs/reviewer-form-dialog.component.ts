import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, startWith, take } from 'rxjs/operators';
import { AppState } from 'src/app/app.state';
import { DictionaryService } from 'src/app/services/rest/dictionary.service';
import { FacultyService } from 'src/app/services/rest/faculty.service';
import { ReviewerService } from 'src/app/services/rest/reviewer.service';
import { DictionaryGetUpdateDTO } from 'src/app/shared/types/dto/dictionary/DictionaryGetUpdateDTO';
import { FacultyGetUpdateDTO } from 'src/app/shared/types/dto/faculty/FacultyGetUpdateDTO';
import { DictionaryFormDialogComponent } from './dictionary-form-dialog.component';
import { FacultyFormDialogComponent } from './faculty-form-dialog.component';

@Component({
  selector: 'app-reviewer-form-dialog',
  styles: [`
    .dialog-header {
      display: flex;
    }

    .dialog-content {
      display: flex;
      flex-direction: column;
    }
  `],
  template: `
    <div class="dialog-header">
      <h1 mat-dialog-title>{{prefs?.edit === true ? "Edit reviewer" : "Add reviewer"}}</h1>
      <div class="spacer"></div>
      <button mat-icon-button (click)="closeDialog()">
        <mat-icon>close</mat-icon>
      </button>
    </div>
    <div mat-dialog-content class="dialog-content">
      <div class="flex-row">
        <mat-form-field appearance="fill" style="flex: 1;">
          <mat-label>Title</mat-label>
          <mat-select [formControl]="titleFormControl">
            <mat-option *ngFor="let title of titles" [value]="title.id">
              {{title.name}}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <div style="width: 120px;">
          <button mat-icon-button (click)="openTitleFormDialog({edit: false})">
            <mat-icon>add</mat-icon>
          </button>
          <button mat-icon-button [disabled]="!titleFormControl.value" (click)="openTitleFormDialog({edit: true})">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button [disabled]="!titleFormControl.value">
            <mat-icon>delete</mat-icon>
          </button>
        </div>
      </div>
      <div class="flex-row">
        <mat-form-field appearance="fill" style="margin-right: 5px;">
          <mat-label>Name</mat-label>
          <input matInput [formControl]="nameFormControl">
        </mat-form-field>
        <mat-form-field appearance="fill" style="margin-left: 5px;">
          <mat-label>Surname</mat-label>
          <input matInput [formControl]="surnameFormControl">
        </mat-form-field>
      </div>
      <div class="flex-row">
        <mat-form-field appearance="fill" style="flex: 1;">
          <mat-label>Email</mat-label>
          <input matInput [formControl]="emailFormControl">
        </mat-form-field>
      </div>
      <div class="flex-row">
        <mat-form-field appearance="fill" style="flex: 1;">
          <mat-label>Faculty</mat-label>
          <mat-select [formControl]="facultyFormControl">
            <mat-option *ngFor="let faculty of faculties" [value]="faculty.id">
              {{faculty.symbol}} - {{faculty.name}}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <div style="width: 120px;">
          <button mat-icon-button (click)="openFacultyFormDialog({edit: false})">
            <mat-icon>add</mat-icon>
          </button>
          <button mat-icon-button [disabled]="!facultyFormControl.value" (click)="openFacultyFormDialog({edit: true})">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button [disabled]="!facultyFormControl.value">
            <mat-icon>delete</mat-icon>
          </button>
        </div>
      </div>
      <div class="flex-row">
        <mat-form-field appearance="fill" style="flex: 1;">
          <mat-label>Tags</mat-label>
          <mat-chip-list #chipList>
            <mat-chip
              *ngFor="let tag of selectedTags"
              (removed)="remove(tag)">
              {{tag.name}}
              <button matChipRemove>
                <mat-icon>cancel</mat-icon>
              </button>
            </mat-chip>
            <input
              #tagInput
              [formControl]="tagFormControl"
              [matAutocomplete]="auto"
              [matChipInputFor]="chipList"
              [matChipInputSeparatorKeyCodes]="separatorKeyCodes"
              (matChipInputTokenEnd)="add($event)">
          </mat-chip-list>
          <mat-autocomplete #auto="matAutocomplete" (optionSelected)="selected($event)">
            <mat-option *ngFor="let tag of filteredTags | async" [value]="tag">
              {{tag.name}}
            </mat-option>
          </mat-autocomplete>
        </mat-form-field>
        <div style="width: 40px;">
          <button mat-icon-button (click)="openTagFormDialog({edit: false})">
            <mat-icon>add</mat-icon>
          </button>
        </div>
      </div>
    </div>
    <div mat-dialog-actions style="float: right;">
      <button mat-stroked-button (click)="processForm()">Confirm</button>
      <button mat-stroked-button (click)="closeDialog()">Cancel</button>
    </div>
  `
})
export class ReviewerFormDialogComponent implements OnInit {
  separatorKeyCodes: number[] = [ENTER, COMMA];

  titles: DictionaryGetUpdateDTO[] = [];
  tags: DictionaryGetUpdateDTO[] = [];
  faculties: FacultyGetUpdateDTO[] = [];
  selectedTags: DictionaryGetUpdateDTO[] = [];
  filteredTags: Observable<DictionaryGetUpdateDTO[]>;
  @ViewChild('tagInput') tagInput!: ElementRef<HTMLInputElement>;

  selectedReviewerId$: Observable<number>;

  titleFormControl: FormControl = new FormControl(undefined, [Validators.required]);
  nameFormControl: FormControl = new FormControl('', [Validators.required]);
  surnameFormControl: FormControl = new FormControl('', [Validators.required]);
  emailFormControl: FormControl = new FormControl('', [Validators.email]);
  facultyFormControl: FormControl = new FormControl(undefined, [Validators.required]);
  tagFormControl: FormControl = new FormControl();

  constructor(private dialogRef: MatDialogRef<ReviewerFormDialogComponent>,
    private reviewerService: ReviewerService,
    private dictionaryService: DictionaryService,
    private facultyService: FacultyService,
    private store: Store<AppState>,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) readonly prefs?: { edit: boolean }) {
    this.selectedReviewerId$ = store.select('selectedReviewerId');
    this.filteredTags = this.tagFormControl.valueChanges.pipe(
      startWith(null),
      map((tagName: string | null) => (tagName ? this._filter(tagName) : this.tags.slice()))
    );
  }

  ngOnInit(): void {
    this.updateFacultyList();
    this.updateTitleList();
    this.updateTagList();
    if (this.prefs?.edit) {
      this.selectedReviewerId$.pipe(take(1)).subscribe(
        (selectedReviewerId) => {
          this.reviewerService.get(selectedReviewerId).subscribe({
            next: (result) => {
              if (result.length > 0) {
                this.titleFormControl.setValue(result[0].title.id);
                this.nameFormControl.setValue(result[0].name);
                this.surnameFormControl.setValue(result[0].surname);
                this.emailFormControl.setValue(result[0].email);
                this.facultyFormControl.setValue(result[0].faculty.id);
                if (result[0].tags.length > 0)
                  this.selectedTags = result[0].tags;
              }
            }
          })
        }
      )
    }
  }

  closeDialog(requestListUpdate?: boolean): void {
    this.snackbar.dismiss();
    this.dialogRef.close({ requestListUpdate: requestListUpdate });
  }

  add(event: MatChipInputEvent): void {
    const tagName = event.value;
    const searchResult = this.tags.find((element) => element.name === tagName);
    if (searchResult) {
      this.selectedTags.push(searchResult);
      event.chipInput!.clear();
      this.tagFormControl.setValue(null);
    } else {
      this.snackbar.open(`Tag "${tagName}" does not exist. You might want to add it with the + button`, "OK", { duration: 4000 });
    }
  }

  remove(tag: DictionaryGetUpdateDTO): void {
    const index = this.selectedTags.indexOf(tag);
    if (index >= 0)
      this.selectedTags.splice(index, 1);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const tagName = event.option.viewValue;
    const searchResult = this.tags.find((element) => element.name === tagName);
    if (searchResult) {
      this.selectedTags.push(searchResult)
      this.tagInput.nativeElement.value = '';
      this.tagFormControl.setValue(null);
    } else {
      this.snackbar.open("Unknown error", "OK", { duration: 3000 });
    }
  }

  private _filter(value: string): DictionaryGetUpdateDTO[] {
    let filterValue = value
    if (typeof value === 'object')
      filterValue = (value as DictionaryGetUpdateDTO).name;
    filterValue = filterValue.toLowerCase().replace(/ /g, "");
    return this.tags.filter((tag) => tag.name.toLowerCase().replace(/ /g, "").includes(filterValue));
  }

  updateTitleList(): void {
    this.dictionaryService.get("title").subscribe({
      next: (result) => this.titles = result
    })
  }

  updateFacultyList(): void {
    this.facultyService.get().subscribe({
      next: (result) => this.faculties = result
    })
  }

  updateTagList(): void {
    this.dictionaryService.get("tag").subscribe({
      next: (result) => this.tags = result
    })
  }

  openTitleFormDialog(prefs: {edit: boolean}): void {
    this.dialog.open(DictionaryFormDialogComponent, { data: { valueType: "title", editId: prefs.edit ? this.titleFormControl.value : undefined } }).afterClosed().subscribe({
      next: (result) => {
        if (result?.requestListUpdate)
          this.updateTitleList();
      }
    })
  }

  openTagFormDialog(prefs: {edit: boolean}): void {
    this.dialog.open(DictionaryFormDialogComponent, { data: { valueType: "tag", editId: prefs.edit ? this.titleFormControl.value : undefined } }).afterClosed().subscribe({
      next: (result) => {
        if (result?.requestListUpdate)
          this.updateTagList();
      }
    })
  }

  openFacultyFormDialog(prefs: {edit: boolean}): void {
    this.dialog.open(FacultyFormDialogComponent, { data: { editId: prefs.edit ? this.titleFormControl.value : undefined } }).afterClosed().subscribe({
      next: (result) => {
        if (result?.requestListUpdate)
          this.updateFacultyList();
      }
    })
  }

  processForm(): void {
    if (!this.titleFormControl.value)
      this.snackbar.open("Title cannot be empty", "Close", { duration: 3000 });
    else if (this.nameFormControl.value.length === 0)
      this.snackbar.open("Name cannot be empty", "Close", { duration: 3000 });
    else if (this.surnameFormControl.value.length === 0)
      this.snackbar.open("Surname cannot be empty", "Close", { duration: 3000 });
    else if (this.emailFormControl.errors)
      this.snackbar.open("Enter valid email or leave the field empty", "Close", { duration: 3000 });
    else if (!this.facultyFormControl.value)
      this.snackbar.open("Name cannot be empty", "Close", { duration: 3000 });
    else {
      if (this.prefs?.edit) {
        this.selectedReviewerId$.pipe(take(1)).subscribe((selectedReviewerId) => this.reviewerService.update({
          id: selectedReviewerId, 
          titleId: this.titleFormControl.value as number, 
          name: this.nameFormControl.value as string, 
          surname: this.surnameFormControl.value as string, 
          email: this.emailFormControl.value as string,
          facultyId: this.facultyFormControl.value as number,
          tagIdList: this.selectedTags.map((item) => item.id)
        }).subscribe({
          next: () => this.closeDialog(true),
          error: () => this.snackbar.open("Unknown error", "Close", { duration: 3000 })
        }))
      } else {
        this.reviewerService.add({ 
          titleId: this.titleFormControl.value as number, 
          name: this.nameFormControl.value as string, 
          surname: this.surnameFormControl.value as string, 
          email: this.emailFormControl.value as string,
          facultyId: this.facultyFormControl.value as number,
          tagIdList: this.selectedTags.map((item) => item.id)
        }).subscribe({
          next: () => this.closeDialog(true),
          error: () => this.snackbar.open("Unknown error", "Close", { duration: 3000 })
        })
      }
    }

  }
}
