import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/app.state';
import { ThesisService } from 'src/app/services/rest/thesis.service';
import { setSelectedReviewerId } from 'src/app/shared/redux/selected-reviewer-id/selected-reviewer-id.actions';
import { setSelectedThesisId } from 'src/app/shared/redux/selected-thesis-id/selected-thesis-id.actions';
import { ThesisGetDTO } from 'src/app/shared/types/dto/thesis/ThesisGetDTO';

@Component({
  selector: 'app-thesis-table-assign',
  styles: [`
    table {
      width: 100%;
    }

    .mat-row .mat-cell {
      border-bottom: 1px solid transparent;
      border-top: 1px solid transparent;
      cursor: pointer;
    }

    .mat-row:hover .mat-cell {
      border-color: currentColor;
    }

    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .row-selected {
      background-color: #e0e0e0;
    }

    .no-items {
      text-align: center;
      color: #bdbdbd;
    }
  `],
  template: `
    <div *ngIf="!dataSource" class="loading">
      <mat-spinner></mat-spinner>
    </div>
    <div *ngIf="dataSource">
      <table mat-table [dataSource]="dataSource" aria-describedby="Theses table">
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef id="idColumn">ID</th>
          <td mat-cell *matCellDef="let element">{{element.id}}</td>
        </ng-container>
        <ng-container matColumnDef="authorAlbumNumber">
          <th mat-header-cell *matHeaderCellDef id="albumColumn">Author album number</th>
          <td mat-cell *matCellDef="let element">{{element.authorAlbumNumber}}</td>
        </ng-container>
        <ng-container matColumnDef="topic">
          <th mat-header-cell *matHeaderCellDef id="topicColumn">Topic</th>
          <td mat-cell *matCellDef="let element">{{element.topic}}</td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr class="mat-row" *matNoDataRow>
          <td class="mat-cell" [colSpan]="displayedColumns.length">
            <div class="no-items">No items</div>
          </td>
        </tr>
        <tr mat-row *matRowDef="let item; columns: displayedColumns;"
          (click)="setSelectedItem(item)"
          [class.row-selected]="item.id === (selectedId$ | async)"></tr>
      </table>
    </div>
  `
})
export class ThesisTableAssignComponent implements OnInit {
  readonly displayedColumns: string[] = ["id", "authorAlbumNumber", "topic"];
  selectedId$: Observable<number>;

  dataSource: MatTableDataSource<ThesisGetDTO> = new MatTableDataSource;

  constructor(private thesisService: ThesisService, private store: Store<AppState>) {
    this.selectedId$ = store.select('selectedThesisId');
  }

  ngOnInit(): void {
    this.updateList();
  }

  setSelectedItem(item: ThesisGetDTO) {
    this.store.dispatch(setSelectedThesisId({id: item.id}));
    this.store.dispatch(setSelectedReviewerId({ id: item.reviewer ? item.reviewer.id : 0}));
  }

  updateList(): void {
    this.thesisService.get().subscribe(
      {
        next: (response: ThesisGetDTO[]) => {
          this.dataSource = new MatTableDataSource(response);
        }
      }
    )
  }

}
