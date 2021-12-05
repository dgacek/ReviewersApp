import { Component, Input, OnInit, SimpleChange, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/app.state';
import { ReviewerService } from 'src/app/services/rest/reviewer.service';
import { setSelectedReviewerId } from 'src/app/shared/redux/selected-reviewer-id/selected-reviewer-id.actions';
import { ReviewerGetDTO } from 'src/app/shared/types/dto/reviewer/ReviewerGetDTO';

@Component({
  selector: 'app-reviewer-table-browse',
  templateUrl: './reviewer-table-browse.component.html',
  styleUrls: ['./reviewer-table-browse.component.scss']
})
export class ReviewerTableBrowseComponent implements OnInit {

  readonly displayedColumns: string[] = ["id", "name", "surname", "title", "faculty", "email"];
  selectedId$: Observable<number>;
  dataSource: MatTableDataSource<ReviewerGetDTO> = new MatTableDataSource;
  @Input() viewUpdater: boolean = false;
  @ViewChild(MatSort, {static: false}) private sort: MatSort = new MatSort;

  constructor(private reviewerService: ReviewerService, private store: Store<AppState>) {
    this.selectedId$ = store.select('selectedReviewerId');
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
    this.store.dispatch(setSelectedReviewerId({ id: item.id }));
  }

  updateList(): void {
    this.reviewerService.get().subscribe(
      {
        next: (response: ReviewerGetDTO[]) => {
          console.log(response);
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
        }
      }
    )
  }

}
