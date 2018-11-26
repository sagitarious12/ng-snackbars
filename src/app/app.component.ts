import { Component } from '@angular/core';

import { NgSnackbars, Snackbar } from 'ng-snackbars';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public options: Snackbar = {
    title: "This is the title"
  }

  constructor(
    private snack: NgSnackbars,
  ) { }

  snackBar() {
    this.snack.create(this.options);
  }

}
