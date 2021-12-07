import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/app.state';
import { ReviewerService } from 'src/app/services/rest/reviewer.service';
import { ReviewerFormDialogComponent } from './dialogs/reviewer-form-dialog.component';

@Component({
  selector: 'app-reviewers-toolbar',
  styles: [`

  `],
  template: `
    <div>
      <button mat-icon-button>
        <mat-icon>add</mat-icon>
      </button>
      <button mat-icon-button [disabled]="(selectedId$ | async) === 0">
        <mat-icon>edit</mat-icon>
      </button>
      <button mat-icon-button [disabled]="(selectedId$ | async) === 0">
        <mat-icon>delete</mat-icon>
      </button>
    </div>
  `
})
export class ReviewersToolbarComponent {

  selectedId$: Observable<number>;
  @Output() dataUpdated = new EventEmitter();

  constructor(private reviewerService: ReviewerService,
    private dialog: MatDialog,
    private store: Store<AppState>) {
    this.selectedId$ = store.select('selectedReviewerId');
  }

  openFormDialog(prefs: { edit: boolean }): void {
    const dialogRef = this.dialog.open(ReviewerFormDialogComponent, prefs.edit ? { data: this.selectedId$ } : undefined);
    dialogRef.afterClosed().subscribe(this.handleDialogClose.bind(this));
  }

  private handleDialogClose(response: any): void {
    if (response && response.updateList) {
      this.dataUpdated.emit();
    }
  }

}
