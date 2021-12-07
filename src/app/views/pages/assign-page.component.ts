import { Component, OnInit } from '@angular/core';

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

    .thesis-details {
      flex: 3;
    }

    .thesis-table {
      flex: 7;
    }

    .assign-button {
      height: 100%;
      flex: 2;
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
        <div class="thesis-details">

        </div>
        <div class="thesis-table">
          <app-thesis-table-assign></app-thesis-table-assign>
        </div>
      </div>
      <div class="assign-button">

      </div>
      <div class="right-panel">
        
      </div>
    </div>
  `
})
export class AssignPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
