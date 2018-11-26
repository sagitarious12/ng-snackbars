import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Renderer2 } from '@angular/core';
import { NgSnackbars } from 'ng-snackbars';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
  ],
  providers: [NgSnackbars],
  bootstrap: [AppComponent]
})
export class AppModule { }
