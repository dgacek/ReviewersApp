import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AppState } from 'src/app/app.state';
import { DictionaryService } from 'src/app/services/rest/dictionary.service';
import { FacultyService } from 'src/app/services/rest/faculty.service';
import { ReviewerService } from 'src/app/services/rest/reviewer.service';
import { DictionaryGetUpdateDTO } from 'src/app/shared/types/dto/dictionary/DictionaryGetUpdateDTO';
import { FacultyGetUpdateDTO } from 'src/app/shared/types/dto/faculty/FacultyGetUpdateDTO';

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
          <button mat-icon-button>
            <mat-icon>add</mat-icon>
          </button>
          <button mat-icon-button [disabled]="!titleFormControl.value">
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
          <button mat-icon-button>
            <mat-icon>add</mat-icon>
          </button>
          <button mat-icon-button [disabled]="!facultyFormControl.value">
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
          <button mat-icon-button>
            <mat-icon>add</mat-icon>
          </button>
        </div>
      </div>
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
    private thesisService: ReviewerService,
    private dictionaryService: DictionaryService,
    private facultyService: FacultyService,
    private store: Store<AppState>,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) readonly prefs?: { edit: boolean }) {
    this.selectedReviewerId$ = store.select('selectedReviewerId');
    this.filteredTags = this.tagFormControl.valueChanges.pipe(
      startWith(null),
      map((tagName: string | null) => (tagName ? this._filter(tagName) : this.tags.slice()))
    );
  }

  ngOnInit(): void {

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
    const filterValue = value.toLowerCase().replace(/ /g, "");
    return this.tags.filter((tag) => tag.name.toLowerCase().replace(/ /g, "").includes(filterValue));
  }
}
