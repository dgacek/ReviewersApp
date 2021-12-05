import { Component, Input, OnInit, SimpleChange, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/app.state';
import { ThesisService } from 'src/app/services/rest/thesis.service';
import { setSelectedReviewerId } from 'src/app/shared/redux/selected-reviewer-id/selected-reviewer-id.actions';
import { setSelectedThesisId } from 'src/app/shared/redux/selected-thesis-id/selected-thesis-id.actions';
import { ThesisGetDTO } from 'src/app/shared/types/dto/thesis/ThesisGetDTO';

@Component({
  selector: 'app-thesis-table-browse',
  templateUrl: './thesis-table-browse.component.html',
  styleUrls: ['./thesis-table-browse.component.scss']
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
    this.store.dispatch(setSelectedThesisId({id: item.id}));
    this.store.dispatch(setSelectedReviewerId({ id: item.reviewer ? item.reviewer.id : 0}));
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
