import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PreviewComponent } from './preview/preview.component';
import { DatePipe } from '@angular/common';

const ngxModules = [
  ButtonsModule.forRoot(),
  TabsModule.forRoot(),
  BsDatepickerModule.forRoot(),
];
@NgModule({
  declarations: [AppComponent, PreviewComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ...ngxModules
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
