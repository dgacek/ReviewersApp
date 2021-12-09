import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { AppState } from 'src/app/app.state';
import { ThesisService } from 'src/app/services/rest/thesis.service';
import { ThesisGetDTO } from 'src/app/shared/types/dto/thesis/ThesisGetDTO';

@Component({
  selector: 'app-assign-page',
  styles: [`
    .root {
      display: flex;
      height: 100%;
      width: 100%;
    }

    .left-panel {
      display: flex;
      flex: 6;
      height: 100%;
      flex-direction: column;
    }

    .assign-button {
      height: 100%;
      flex: 2;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .right-panel {
      display: flex;
      flex: 6;
      height: 100%;
      flex-direction: column;
    }
  `],
  template: `
    <div class="root">
      <div class="left-panel">
        <app-thesis-table-assign (selectedItemChanged)="handleSelectedThesisChange($event)" [updatedThesis]="updatedThesis"></app-thesis-table-assign>
      </div>
      <div class="assign-button">
        <button mat-fab [disabled]="selectedThesis === undefined || selectedThesis.reviewer !== null || (selectedReviewerId$ | async) === 0" (click)="assignReviewer()">
          <mat-icon>done</mat-icon>
        </button>
      </div>
      <div class="right-panel">
        <app-reviewer-table-assign></app-reviewer-table-assign>
      </div>
    </div>
  `
})
export class AssignPageComponent {
  selectedThesis?: ThesisGetDTO;
  selectedReviewerId$: Observable<number>;
  updatedThesis?: ThesisGetDTO;

  constructor(private thesisService: ThesisService,
    private store: Store<AppState>) {
      this.selectedReviewerId$ = store.select('selectedReviewerId');
    }

  handleSelectedThesisChange(item: ThesisGetDTO) {
    this.selectedThesis = item;
  }

  assignReviewer() {
    this.selectedReviewerId$.pipe(take(1)).subscribe(
      (selectedReviewerId) => {
        this.thesisService.update({ reviewerId: selectedReviewerId, ...this.selectedThesis! }).subscribe(
          {
            next: (response) => {
              this.updatedThesis = response;
            }
          }
        )
      }
    )
  }

}
