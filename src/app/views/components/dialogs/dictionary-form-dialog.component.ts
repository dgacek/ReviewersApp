import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DictionaryService } from 'src/app/services/rest/dictionary.service';

@Component({
  selector: 'app-dictionary-form-dialog',
  template: `
    <p>
      dictionary-form-dialog works!
    </p>
  `,
  styles: [
  ]
})
export class DictionaryFormDialogComponent implements OnInit {

  name: string = "";

  constructor(private dictionaryService: DictionaryService,
    private dialogRef: MatDialogRef<DictionaryFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) readonly prefs: {editId?: number, valueType: string}) { }

  ngOnInit(): void {
    if (this.prefs.editId) {
      this.dictionaryService.get(this.prefs.valueType, this.prefs.editId).subscribe(
        {
          next: (response) => {
            this.name = response[0].name;
          }
        }
      )
    }
  }

}
