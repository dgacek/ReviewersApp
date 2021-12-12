import { Component, Input, OnInit, SimpleChange, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { AppState } from 'src/app/app.state';
import { ThesisService } from 'src/app/services/rest/thesis.service';
import { setSelectedReviewerId } from 'src/app/shared/redux/selected-reviewer-id/selected-reviewer-id.actions';
import { setSelectedThesisId } from 'src/app/shared/redux/selected-thesis-id/selected-thesis-id.actions';
import { ThesisGetDTO } from 'src/app/shared/types/dto/thesis/ThesisGetDTO';

@Component({
  selector: 'app-thesis-table-browse',
  styles: [`

    .table-container {
      max-height: 84vh;
      overflow: auto;
    }

    table {
      width: 100%;
    }

    .mat-row .mat-cell {
      border-bottom: 1px solid transparent;
      border-top: 1px solid transparent;
      cursor: pointer;
    }

    .mat-header-row {
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .mat-row:hover .mat-cell {
      border-color: currentColor;
    }

    .row-selected {
      background-color: #e0e0e0; /* mat-grey 300 */
    }

    .no-items {
      text-align: center;
      color: #bdbdbd; /* mat-grey 400 */
    }
  `],
  template: `
    <div class="table-container">
      <table mat-table [dataSource]="dataSource" matSort aria-describedby="Theses table">
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef mat-sort-header id="idColumn">ID</th>
          <td mat-cell *matCellDef="let element">{{element.id}}</td>
        </ng-container>
        <ng-container matColumnDef="authorAlbumNumber">
          <th mat-header-cell *matHeaderCellDef mat-sort-header id="albumColumn">Author album number</th>
          <td mat-cell *matCellDef="let element">{{element.authorAlbumNumber}}</td>
        </ng-container>
        <ng-container matColumnDef="topic">
          <th mat-header-cell *matHeaderCellDef mat-sort-header id="topicColumn">Topic</th>
          <td mat-cell *matCellDef="let element">{{element.topic}}</td>
        </ng-container>
        <ng-container matColumnDef="reviewer">
          <th mat-header-cell *matHeaderCellDef mat-sort-header id="reviewerColumn">Reviewer</th>
          <td mat-cell *matCellDef="let element">{{element.reviewer ? element.reviewer.title.name+" "+element.reviewer.name+" "+element.reviewer.surname : ""}}</td>
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
export class ThesisTableBrowseComponent implements OnInit {

  readonly displayedColumns: string[] = ["id", "authorAlbumNumber", "topic", "reviewer"];
  selectedId$: Observable<number>;
  dataSource: MatTableDataSource<ThesisGetDTO> = new MatTableDataSource;
  @Input() viewUpdater: boolean = false;
  @ViewChild(MatSort, {static: false}) private sort: MatSort = new MatSort;

  constructor(private thesisService: ThesisService, private store: Store<AppState>) {
    this.selectedId$ = store.select('selectedThesisId');
  }

  ngOnInit(): void {
    this.updateList();
  }

  ngOnChanges(changes: { [property: string]: SimpleChange }) {
    let updateView: SimpleChange = changes['viewUpdater'];
    if (updateView) {
      this.updateList();
    }
  }

  setSelectedItem(item: ThesisGetDTO) {
    this.store.pipe(select('selectedThesisId'), take(1)).subscribe(
      (selectedId) => {
        if (selectedId === item.id)
          this.store.dispatch(setSelectedThesisId({ id: 0 }));
        else {
          this.store.dispatch(setSelectedThesisId({ id: item.id }));
          if (item.reviewer)
            this.store.dispatch(setSelectedReviewerId({ id: item.reviewer.id }));
        }
        
      }
    );
  }

  updateList(): void {
    this.thesisService.get().subscribe(
      {
        next: (response: ThesisGetDTO[]) => {
          this.dataSource = new MatTableDataSource(response);
          this.dataSource.sortingDataAccessor = (item, property) => {
            switch (property) {
              case 'id': return item.id;
              case 'authorAlbumNumber': return item.authorAlbumNumber;
              case 'topic': return item.topic;
              case 'reviewer': return item.reviewer ? `${item.reviewer.title} ${item.reviewer.name} ${item.reviewer.surname}` : "";
              default: return "";
            }
          }
          this.dataSource.sort = this.sort;
        }
      }
    )
  }

}
