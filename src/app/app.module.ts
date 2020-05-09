import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataService } from './shared/data.service';
import { HttpClientModule } from '@angular/common/http';
import { RoutingModule } from './routing/routing.module';
import { BarChartModule, LineChartModule, BubbleChartModule } from '@swimlane/ngx-charts';

@NgModule({
  declarations: [
    AppComponent,
    RoutingModule.components
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    LineChartModule,
    BarChartModule,
    BubbleChartModule
  ],
  providers: [
    DataService
  ],
  bootstrap: [
    AppComponent
  ]
})

export class AppModule { }

