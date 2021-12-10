import { Component, EventEmitter, Input, OnInit, Output, SimpleChange } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
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

    .details-root {
      padding: 30px;
      display: flex;
      flex-direction: column;
      flex: 3;
    }

    .table-root {
      flex: 7;
    }

    .details {
      flex: 1;
    }

    .button-nav {
      width: 100%;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
    }
  `],
  template: `
    <div class="details-root">
      <div class="button-nav">
        <button mat-mini-fab color="primary" [disabled]="(selectedIndex === undefined) || (selectedIndex <= 0)" (click)="setSelectedItem(selectedIndex! - 1)">
          <mat-icon>arrow_upward</mat-icon>
        </button>
      </div>
      <div class="details">
          <h3>Topic:</h3>
          <p>{{selectedItem ? selectedItem.topic : " "}}</p>
          <br>
          <h4>Author album number:</h4>
          <p>{{selectedItem ? selectedItem.authorAlbumNumber : " "}}</p>
      </div>
      <div class="button-nav">
        <button mat-mini-fab color="primary" [disabled]="(selectedIndex === undefined) || (selectedIndex! + 1 >= dataSource.data.length)" (click)="setSelectedItem(selectedIndex! + 1)">
          <mat-icon>arrow_downward</mat-icon>
        </button>
      </div>
    </div>
    <div class="table-root">
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
          <tr mat-row *matRowDef="let item; let i = index; columns: displayedColumns;"
            (click)="setSelectedItem(i)"
            [class.row-selected]="item.id === (selectedId$ | async)"></tr>
        </table>
      </div>
    </div>
  `
})
export class ThesisTableAssignComponent implements OnInit {
  readonly displayedColumns: string[] = ["id", "authorAlbumNumber", "topic"];
  selectedId$: Observable<number>;
  selectedItem?: ThesisGetDTO;
  selectedIndex?: number;

  @Output() selectedItemChanged: EventEmitter<ThesisGetDTO> = new EventEmitter();
  @Input() updatedThesis?: ThesisGetDTO;

  dataSource: MatTableDataSource<ThesisGetDTO> = new MatTableDataSource;

  constructor(private thesisService: ThesisService, private store: Store<AppState>) {
    this.selectedId$ = store.select('selectedThesisId');
  }

  ngOnInit(): void {
    this.thesisService.get().subscribe(
      {
        next: (response: ThesisGetDTO[]) => {
          this.dataSource = new MatTableDataSource(response);
          this.selectedId$.pipe(take(1)).subscribe(
            (selectedId) => {
              let index = this.dataSource.data.findIndex((item) => item.id === selectedId);
              if (index !== -1)
                this.setSelectedItem(index);
            }
          )
        }
      }
    )
  }

  ngOnChanges(changes: { [property: string]: SimpleChange }) {
    let thesisChange: SimpleChange = changes['updatedThesis'];
    if (thesisChange.currentValue !== undefined) {
      let index = this.dataSource.data.findIndex((item) => item.id === thesisChange.currentValue.id);
      if (index !== -1 && index + 1 < this.dataSource.data.length)
        this.setSelectedItem(index + 1);
    }
  }

  setSelectedItem(index: number) {
    this.selectedIndex = index;
    this.selectedItem = this.dataSource.data[this.selectedIndex];
    this.selectedItemChanged.emit(this.selectedItem);
    this.store.dispatch(setSelectedThesisId({ id: this.selectedItem.id }));
    this.store.dispatch(setSelectedReviewerId({ id: this.selectedItem.reviewer ? this.selectedItem.reviewer.id : 0 }));
  }

}
