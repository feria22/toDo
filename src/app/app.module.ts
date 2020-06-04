import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {HttpClientInMemoryWebApiModule} from "angular-in-memory-web-api";
import { InMemHeroService } from './data/InMemoryDataService ';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CategoryComponent } from './views/category/category.component';
import { TaskComponent } from './views/task/task.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

const Materialize = [
  MatProgressSpinnerModule
]
@NgModule({
  declarations: [
    AppComponent,
    CategoryComponent,
    TaskComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(InMemHeroService,{ dataEncapsulation: false }),
    BrowserAnimationsModule,
    Materialize
  ],
  exports:[
    Materialize
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

}
