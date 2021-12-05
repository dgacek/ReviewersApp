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
  templateUrl: './thesis-table-assign.component.html',
  styleUrls: ['./thesis-table-assign.component.scss']
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
