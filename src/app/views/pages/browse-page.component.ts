import { Component } from '@angular/core';

@Component({
  selector: 'app-browse-page',
  styles: [`
    .root {
      display: flex;
      height: 100%;
      width: 100%;
    }

    .panel {
      display: flex;
      flex: 1;
      height: 100%;
      width: 100%;
      flex-direction: column;
    }
  `],
  template: `
    <div class="root">
      <div class="panel">
        <app-theses-toolbar (dataUpdated)="thesisUpdater = !thesisUpdater"></app-theses-toolbar>
        <app-thesis-table-browse [viewUpdater]="thesisUpdater"></app-thesis-table-browse>
      </div>
      <div class="panel">
        <app-reviewers-toolbar (dataUpdated)="reviewerUpdater = !reviewerUpdater" (thesesUpdated)="thesisUpdater = !thesisUpdater"></app-reviewers-toolbar>
        <app-reviewer-table-browse [viewUpdater]="reviewerUpdater"></app-reviewer-table-browse>
      </div>
    </div>
  `
})
export class BrowsePageComponent {

  thesisUpdater = false;
  reviewerUpdater = false;

}
