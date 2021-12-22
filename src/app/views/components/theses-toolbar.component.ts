import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { AppState } from 'src/app/app.state';
import { ThesisService } from 'src/app/services/rest/thesis.service';
import { GenericYesnoDialogComponent } from './dialogs/generic-yesno-dialog.component';
import { ThesisFormDialogComponent } from './dialogs/thesis-form-dialog.component';

@Component({
  selector: 'app-theses-toolbar',
  styles: [`

  `],
  template: `
    <div>
      <button mat-icon-button (click)="openFormDialog({edit: false})">
        <mat-icon>add</mat-icon>
      </button>
      <button mat-icon-button (click)="openFormDialog({edit: true})" [disabled]="(selectedId$ | async) === 0">
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
export class ThesesToolbarComponent {

  selectedId$: Observable<number>;
  @Output() dataUpdated = new EventEmitter();

  constructor(private dialog: MatDialog,
    private store: Store<AppState>,
    private thesisService: ThesisService) {
    this.selectedId$ = store.select('selectedThesisId');
  }

  openFormDialog(prefs: { edit: boolean }): void {
    this.dialog.open(ThesisFormDialogComponent, { data: prefs, width: "30%" })
      .afterClosed().subscribe(this._handleDialogClose.bind(this))
  }

  openDeleteDialog(): void {
    this.dialog.open(GenericYesnoDialogComponent, {data: {title: "Usuwanie pracy dyplomowej", text: "Czy na pewno chcesz usunąć tą pracę dyplomową?"}}).afterClosed().subscribe({
      next: (result) => {
        if (result === true) {
          this.selectedId$.pipe(take(1)).subscribe(
            (selectedId) => {
              this.thesisService.delete(selectedId).subscribe({
                next: () => this.dataUpdated.emit(),
              })
            }
          )
        }
      }
    })
  }

  private _handleDialogClose(response: any): void {
    if (response && response.requestListUpdate === true)
      this.dataUpdated.emit();
  }

}
