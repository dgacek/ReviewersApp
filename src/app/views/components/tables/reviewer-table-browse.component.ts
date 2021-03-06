import { Component, Input, OnInit, SimpleChange, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/app.state';
import { ReviewerService } from 'src/app/services/rest/reviewer.service';
import { setSelectedReviewerId } from 'src/app/shared/redux/selected-reviewer-id/selected-reviewer-id.actions';
import { ReviewerGetDTO } from 'src/app/shared/types/dto/reviewer/ReviewerGetDTO';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-reviewer-table-browse',
  styles: [`
    .table-container {
      max-height: calc(100vh - 64px - 49px - 40px - 70.88px);
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
      background-color: #e0e0e0;
    }

    .no-items {
      text-align: center;
      color: #bdbdbd;
    }

    .search-field {
      padding-left: 20px;
      width: 30%;
    }
  `],
  template: `
    <mat-form-field appearance="standard" class="search-field">
      <input matInput (keyup)="applyFilter($event)" placeholder="Szukaj..." #input>
      <mat-icon matPrefix>search</mat-icon>
    </mat-form-field>
    <div class="table-container">
      <table mat-table [dataSource]="dataSource" matSort aria-describedby="Tabela recenzentów">
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef mat-sort-header id="idColumn">ID</th>
          <td mat-cell *matCellDef="let element">{{element.id}}</td>
        </ng-container>
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef mat-sort-header id="albumColumn">Imię</th>
          <td mat-cell *matCellDef="let element">{{element.name}}</td>
        </ng-container>
        <ng-container matColumnDef="surname">
          <th mat-header-cell *matHeaderCellDef mat-sort-header id="surnameColumn">Nazwisko</th>
          <td mat-cell *matCellDef="let element">{{element.surname}}</td>
        </ng-container>
        <ng-container matColumnDef="title">
          <th mat-header-cell *matHeaderCellDef mat-sort-header id="titleColumn">Tytuł</th>
          <td mat-cell *matCellDef="let element">{{element.title.name}}</td>
        </ng-container>
        <ng-container matColumnDef="faculty">
          <th mat-header-cell *matHeaderCellDef mat-sort-header id="facultyColumn">Katedra</th>
          <td mat-cell *matCellDef="let element">{{element.faculty.symbol}} - {{element.faculty.name}}</td>
        </ng-container>
        <ng-container matColumnDef="email">
          <th mat-header-cell *matHeaderCellDef mat-sort-header id="emailColumn">Email</th>
          <td mat-cell *matCellDef="let element">{{element.email ? element.email : ""}}</td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr class="mat-row" *matNoDataRow>
          <td class="mat-cell" [colSpan]="displayedColumns.length">
            <div class="no-items">Brak danych</div>
          </td>
        </tr>
        <tr mat-row *matRowDef="let item; columns: displayedColumns;"
          (click)="setSelectedItem(item)"
          [class.row-selected]="item.id === (selectedId$ | async)"
          [id]="'reviewer'+item.id"></tr>
      </table>
    </div>
  `
})
export class ReviewerTableBrowseComponent implements OnInit {

  readonly displayedColumns: string[] = ["id", "name", "surname", "title", "faculty", "email"];
  selectedId$: Observable<number>;
  dataSource: MatTableDataSource<ReviewerGetDTO> = new MatTableDataSource;
  @Input() viewUpdater: boolean = false;
  @ViewChild(MatSort, {static: false}) private sort: MatSort = new MatSort;

  constructor(private reviewerService: ReviewerService, private store: Store<AppState>) {
    this.selectedId$ = store.select('selectedReviewerId');
    this.selectedId$.subscribe(
      {
        next: (value) => {
          let elmnt = document.getElementById("reviewer"+value);
          if (elmnt)
            elmnt.scrollIntoView({block: 'center'});
        }
      }
    )
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

  setSelectedItem(item: ReviewerGetDTO) {
    this.store.pipe(select('selectedReviewerId'), take(1)).subscribe(
      (selectedId) => {
        this.store.dispatch(setSelectedReviewerId({ id: selectedId === item.id ? 0 : item.id }));
      }
    );
  }

  updateList(): void {
    this.reviewerService.get().subscribe(
      {
        next: (response: ReviewerGetDTO[]) => {
          this.dataSource = new MatTableDataSource(response);
          this.dataSource.sortingDataAccessor = (item, property) => {
            switch (property) {
              case 'id': return item.id;
              case 'name': return item.name;
              case 'surname': return item.surname;
              case 'title': return item.title.name;
              case 'faculty': return `${item.faculty.symbol} - ${item.faculty.name}`;
              case 'email': return item.email ? item.email : "";
              default: return "";
            }
          }
          this.dataSource.sort = this.sort;
          this.dataSource.filterPredicate = (data, filter) => {
            let datastring = "";
            datastring += data.id + data.title.name + data.name + data.surname + data.faculty.symbol + data.faculty.name;
            datastring = datastring.replace(/ /g, '').trim().toLowerCase();
            if (data.tags.length > 0)
              datastring += data.tags.reduce((prev, curr) => { return {name: prev.name+curr.name, id: 0}}).name.replace(/ /g,'').trim().toLowerCase();

            return datastring.includes(filter);
          }
        }
      }
    )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.replace(/ /g, '').trim().toLowerCase();
  }

}
