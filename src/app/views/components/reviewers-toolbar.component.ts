import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { AppState } from 'src/app/app.state';
import { ReviewerService } from 'src/app/services/rest/reviewer.service';
import { GenericYesnoDialogComponent } from './dialogs/generic-yesno-dialog.component';
import { ReviewerFormDialogComponent } from './dialogs/reviewer-form-dialog.component';

@Component({
  selector: 'app-reviewers-toolbar',
  styles: [`

  `],
  template: `
    <div>
      <button mat-icon-button matTooltip="Dodaj recenzenta" (click)="openFormDialog({ edit: false })">
        <mat-icon>add</mat-icon>
      </button>
      <button mat-icon-button matTooltip="Edytuj recenzenta" (click)="openFormDialog({ edit: true })" [disabled]="(selectedId$ | async) === 0">
        <mat-icon>edit</mat-icon>
      </button>
      <button mat-icon-button matTooltip="Usuń recenzenta" (click)="openDeleteDialog()" [disabled]="(selectedId$ | async) === 0">
        <mat-icon>delete</mat-icon>
      </button>
      <button mat-icon-button matTooltip="Import z pliku .xlsx" (click)="openUploadDialog()">
        <mat-icon>file_upload</mat-icon>
      </button>
      <input #fileUploadInput type="file" name="file" [hidden]="true" (change)="handleFileInput($event)" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
    </div>
  `
})
export class ReviewersToolbarComponent {

  selectedId$: Observable<number>;
  @Output() dataUpdated = new EventEmitter();
  @Output() thesesUpdated = new EventEmitter();
  @ViewChild('fileUploadInput') fileUploadInput!: ElementRef<HTMLInputElement>;

  constructor(private dialog: MatDialog,
    private store: Store<AppState>,
    private reviewerService: ReviewerService) {
    this.selectedId$ = store.select('selectedReviewerId');
  }

  openFormDialog(prefs: { edit: boolean }): void {
    this.store.pipe(select('selectedReviewerId'), take(1)).subscribe(
      (selectedId) => {
        const dialogRef = this.dialog.open(ReviewerFormDialogComponent, { data: {edit: prefs.edit} });
        dialogRef.afterClosed().subscribe(this.handleDialogClose.bind(this));
      }
    );
  }

  openDeleteDialog(): void {
    this.dialog.open(GenericYesnoDialogComponent, {data: {title: "Usuwanie recenzenta", text: "Czy na pewno chcesz usunąć tego recenzenta?"}}).afterClosed().subscribe({
      next: (result) => {
        if (result === true) {
          this.selectedId$.pipe(take(1)).subscribe(
            (selectedId) => {
              this.reviewerService.delete(selectedId).subscribe({
                next: () => this.dataUpdated.emit(),
              })
            }
          )
        }
      }
    })
  }

  openUploadDialog(): void {
    this.dialog.open(GenericYesnoDialogComponent, { data: {title: "Import danych z pliku .xlsx", text: "Import nowych danych spowoduje bezpowrotne usunięcie wszystkich istniejących recenzentów (oraz przypisań) z systemu. Czy kontynuować?"} }).afterClosed().subscribe({
      next: (result) => {
        if (result === true) 
          this.fileUploadInput.nativeElement.click()
        }
    })
  }

  handleFileInput(event: Event): void {
    let fileList = (event.target as HTMLInputElement).files;
    let file: File | null = null;
    if (fileList !== null)
      file = fileList.item(0);
    if (file !== null) {
      this.reviewerService.importExcel(file).subscribe({
        next: () => {
          this.dataUpdated.emit();
          this.thesesUpdated.emit();
        }
      });
    }
  }

  private handleDialogClose(response: any): void {
    if (response && response.requestListUpdate) {
      this.dataUpdated.emit();
    }
  }

}
