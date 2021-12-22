import { Component, EventEmitter, Output } from '@angular/core';
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
      <button mat-icon-button (click)="openFormDialog({ edit: false })">
        <mat-icon>add</mat-icon>
      </button>
      <button mat-icon-button (click)="openFormDialog({ edit: true })" [disabled]="(selectedId$ | async) === 0">
        <mat-icon>edit</mat-icon>
      </button>
      <button mat-icon-button (click)="openDeleteDialog()" [disabled]="(selectedId$ | async) === 0">
        <mat-icon>delete</mat-icon>
      </button>
      <button mat-icon-button>
        <mat-icon>upload_file</mat-icon>
      </button>
    </div>
  `
})
export class ReviewersToolbarComponent {

  selectedId$: Observable<number>;
  @Output() dataUpdated = new EventEmitter();

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
    this.dialog.open(GenericYesnoDialogComponent, {data: {title: "Delete reviewer", text: "Are you sure you want to delete this reviewer?"}}).afterClosed().subscribe({
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

  private handleDialogClose(response: any): void {
    if (response && response.requestListUpdate) {
      this.dataUpdated.emit();
    }
  }

}
