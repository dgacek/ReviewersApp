import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-theses-toolbar',
  styles: [`

  `],
  template: `
    <div>
      <button mat-icon-button>
        <mat-icon>add</mat-icon>
      </button>
      <button mat-icon-button>
        <mat-icon>edit</mat-icon>
      </button>
      <button mat-icon-button>
        <mat-icon>delete</mat-icon>
      </button>
      <button mat-icon-button>
        <mat-icon>upload_file</mat-icon>
      </button>
    </div>
  `
})
export class ThesesToolbarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
