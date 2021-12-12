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
      flex: 20;
      height: 100%;
      flex-direction: column;
    }

    .assign-button {
      height: 100%;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-left: 20px;
      padding-right: 20px;
    }

    .right-panel {
      display: flex;
      flex: 20;
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
        <button mat-fab
          *ngIf="selectedThesis !== undefined && selectedThesis.reviewer === null" 
          [disabled]="selectedThesis === undefined || (selectedReviewerId$ | async) === 0" 
          (click)="assignReviewer()"
          [color]="selectedThesis === undefined || selectedThesis.reviewer === null ? 'accent' : 'warn'">
          <mat-icon>done</mat-icon>
          <mat-icon *ngIf="selectedThesis !== undefined && selectedThesis.reviewer !== null">close</mat-icon>
        </button>
        <button mat-fab
          *ngIf="selectedThesis !== undefined && selectedThesis.reviewer !== null" 
          [disabled]="selectedThesis === undefined || (selectedReviewerId$ | async) === 0" 
          (click)="unassignReviewer()"
          [color]="selectedThesis === undefined || selectedThesis.reviewer === null ? 'accent' : 'warn'">
          <mat-icon >close</mat-icon>
        </button>
      </div>
      <div class="right-panel">
        <app-reviewer-table-assign [updatedThesis]="updatedThesis"></app-reviewer-table-assign>
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

  unassignReviewer() {
    this.selectedReviewerId$.pipe(take(1)).subscribe(
      (selectedReviewerId) => {
        this.thesisService.update({ reviewerId: null, ...this.selectedThesis! }).subscribe(
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
