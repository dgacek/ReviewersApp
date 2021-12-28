import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
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
      <button mat-icon-button matTooltip="Dodaj pracę" (click)="openFormDialog({edit: false})">
        <mat-icon>add</mat-icon>
      </button>
      <button mat-icon-button matTooltip="Edytuj pracę" (click)="openFormDialog({edit: true})" [disabled]="(selectedId$ | async) === 0">
        <mat-icon>edit</mat-icon>
      </button>
      <button mat-icon-button matTooltip="Usuń pracę" (click)="openDeleteDialog()" [disabled]="(selectedId$ | async) === 0">
        <mat-icon>delete</mat-icon>
      </button>
      <button mat-icon-button matTooltip="Import z pliku .xlsx" (click)="openUploadDialog()">
        <mat-icon>file_upload</mat-icon>
      </button>
      <input #fileUploadInput type="file" name="file" [hidden]="true" (change)="handleFileInput($event)" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
      <button mat-icon-button matTooltip="Eksport przypisanych prac do pliku .xlsx" (click)="thesisService.exportToExcel()">
        <mat-icon>file_download</mat-icon>
      </button>
    </div>
  `
})
export class ThesesToolbarComponent {

  selectedId$: Observable<number>;
  @Output() dataUpdated = new EventEmitter();
  @ViewChild('fileUploadInput') fileUploadInput!: ElementRef<HTMLInputElement>;

  constructor(private dialog: MatDialog,
    private store: Store<AppState>,
    public thesisService: ThesisService) {
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

  openUploadDialog(): void {
    this.dialog.open(GenericYesnoDialogComponent, { data: {title: "Import danych z pliku .xlsx", text: "Import nowych danych spowoduje bezpowrotne usunięcie wszystkich istniejących prac z systemu. Czy kontynuować?"} }).afterClosed().subscribe({
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
      this.thesisService.importExcel(file).subscribe({
        next: () => this.dataUpdated.emit()
      });
    }
  }

  private _handleDialogClose(response: any): void {
    if (response && response.requestListUpdate === true)
      this.dataUpdated.emit();
  }

}
