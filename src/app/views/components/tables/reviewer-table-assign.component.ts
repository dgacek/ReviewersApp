import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, ElementRef, Input, OnInit, SimpleChange, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, startWith, take } from 'rxjs/operators';
import { AppState } from 'src/app/app.state';
import { DictionaryService } from 'src/app/services/rest/dictionary.service';
import { ReviewerService } from 'src/app/services/rest/reviewer.service';
import { setSelectedReviewerId } from 'src/app/shared/redux/selected-reviewer-id/selected-reviewer-id.actions';
import { ReviewerGetDTO } from 'src/app/shared/types/dto/reviewer/ReviewerGetDTO';
import { ThesisGetDTO } from 'src/app/shared/types/dto/thesis/ThesisGetDTO';

@Component({
  selector: 'app-reviewer-table-assign',
  styles: [`
    .table-container {
      max-height: calc(100vh - 64px - 49px - 127.13px);
      overflow: auto;
    }

    table {
      width: 100%;
    }

    .chip-list {
      width: 100%;
      height: 127.13px;
    }

    .mat-row .mat-cell {
      border-bottom: 1px solid transparent;
      border-top: 1px solid transparent;
      cursor: pointer;
    }

    /* .mat-header-row {
      position: sticky;
      top: 0;
      z-index: 100;
    } */

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
  `],
  template: `
      <mat-form-field class="chip-list" appearance="fill">
        <mat-label>Wyszukaj po tagach</mat-label>
        <mat-chip-list #chipList>
          <mat-chip *ngFor="let tag of selectedTags" (removed)="remove(tag)">
            {{tag}}
            <button matChipRemove>
              <mat-icon>cancel</mat-icon>
            </button>
          </mat-chip>
          <input
            placeholder="Dodaj tag..."
            #tagInput
            [formControl]="tagCtrl"
            [matAutocomplete]="auto"
            [matChipInputFor]="chipList"
            [matChipInputSeparatorKeyCodes]="separatorKeyCodes"
            (matChipInputTokenEnd)="add($event)">
        </mat-chip-list>
        <mat-autocomplete #auto="matAutocomplete" (optionSelected)="selected($event)">
          <mat-option *ngFor="let tag of filteredTags | async" [value]="tag">
            {{tag}}
          </mat-option>
        </mat-autocomplete>
      </mat-form-field>
      <div class=table-container>
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
          <ng-container matColumnDef="tags">
            <th mat-header-cell *matHeaderCellDef id="tagsColumn">Tagi</th>
            <td mat-cell *matCellDef="let element"><span *ngFor="let tag of element.tags; let isLast=last">{{tag.name}}{{isLast ? '' : ', '}}</span></td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></tr>
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
export class ReviewerTableAssignComponent implements OnInit {

  separatorKeyCodes: number[] = [ENTER, COMMA];
  readonly displayedColumns: string[] = ["id", "name", "surname", "title", "faculty", "email", "tags"];
  selectedId$: Observable<number>;
  dataSource: MatTableDataSource<ReviewerGetDTO> = new MatTableDataSource;
  @ViewChild(MatSort, {static: false}) private sort: MatSort = new MatSort;

  allTags: string[] = [];
  selectedTags: string[] = [];
  tagCtrl = new FormControl();
  filteredTags: Observable<string[]>;
  @ViewChild('tagInput') tagInput!: ElementRef<HTMLInputElement>;

  @Input() updatedThesis?: ThesisGetDTO;

  constructor(private store: Store<AppState>,
    private reviewerService: ReviewerService,
    private dictionaryService: DictionaryService) {
      this.selectedId$ = store.select('selectedReviewerId');
      this.filteredTags = this.tagCtrl.valueChanges.pipe(
        startWith(null),
        map((tag: string | null) => (tag ? this._filter(tag) : this.allTags.slice()))
      );
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
    this.updateTags();
  }

  ngOnChanges(changes: { [property: string]: SimpleChange }) {
    let thesisChange: SimpleChange = changes['updatedThesis'];
    if (thesisChange.currentValue !== undefined) {
      this.dataSource.filter = "";
      this.tagInput.nativeElement.value = '';
      this.tagCtrl.setValue(null);
      this.selectedTags = [];
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
            if (data.tags.length > 0)
              datastring = data.tags.reduce((prev, curr) => { return {name: prev.name+curr.name, id: 0}}).name.replace(/ /g,'').toLowerCase();

            return datastring.includes(filter);
          }
        }
      }
    )
  }

  updateTags(): void {
    this.dictionaryService.get("tag").subscribe(
      {
        next: (result) => {
          this.allTags = result.map((item) => item.name);
        }
      }
    )
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value)
      this.selectedTags.push(value);

    event.chipInput!.clear();
    this.tagCtrl.setValue(null);
    this.applyFilter();
  }

  remove(tag: string): void {
    const index = this.selectedTags.indexOf(tag);
    if (index >= 0)
      this.selectedTags.splice(index, 1);
    this.applyFilter();
  }

  selected(event: MatAutocompleteSelectedEvent): void {
   this.selectedTags.push(event.option.viewValue);
   this.tagInput.nativeElement.value = '';
   this.tagCtrl.setValue(null);
   this.applyFilter();
  }

  applyFilter() {
    let filterValue = "";
    if (this.selectedTags.length > 0)
      filterValue = this.selectedTags.reduce((prev, curr) => prev+curr).replace(/ /g,'');
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allTags.filter((item) => item.toLowerCase().includes(filterValue));
  }

}
