import { Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { DataService } from '../shared/data.service';

interface Countries {
  country_name: string;
}
interface Indicators {
  indicator_name: string;
}
interface YearSpans {
  COLUMN_NAME: string;
}
@Component({
  selector: 'app-timeline-chart',
  templateUrl: './timeline-chart.component.html',
  styleUrls: ['./timeline-chart.component.css']
})
export class TimelineChartComponent{
  createGraph = false;
  progressBarValue = 1;
  progress = false;
  isLinear = true;
  step1 = false;
  step2 = false;
  step3 = false;
  Countries = [];
  Indicators = [];
  YearSpans = [];
  selectedCountries = new FormControl();
  selectedIndicators = new FormControl();
  selectedYearSpans = new FormControl();
  constructor( private dataService: DataService, private formBuilder: FormBuilder) {}

  async getCountries(stepper){
    this.step1 = true;
    this.progress = true;
    await this.dataService.getAvailableCountries().then(response => response.json())
      .then(data => {
        Object.entries(data.result).forEach( entry => {
          const countriesObj = entry[1] as Countries;
          this.Countries.push(countriesObj.country_name);
        });
      }).catch(error => console.error(error));
    // console.log(this.Countries);
    this.progress = false;
    stepper.next();
  }

  async getIndicators(stepper){
    this.step2 = true;
    this.progress = true;
    this.progressBarValue = 33;
    await this.dataService.getAvailableIndicators().then(response => response.json())
      .then(data => {
        Object.entries(data.result).forEach( entry => {
          const indicatorsObj = entry[1] as Indicators;
          this.Indicators.push(indicatorsObj.indicator_name);
        });
      }).catch(error => console.error(error));
    // console.log(this.Countries);
    this.progress = false;
    // console.log(this.Indicators);
    stepper.next();
  }

  async getYearSpans(stepper){
    this.step3 = true;
    this.progress = true;
    this.progressBarValue = 66;
    await this.dataService.getAvailableYearSpans().then(response => response.json())
      .then(data => {
        Object.entries(data.result).forEach( entry => {
          const spansObj = entry[1] as YearSpans;
          this.YearSpans.push(spansObj.COLUMN_NAME);
        });
      }).catch(error => console.error(error));
    this.YearSpans = this.YearSpans.filter(column => column !== 'year');
    this.progress = false;
    stepper.next();
  }

  logSelections(stepper){
    this.progressBarValue = 100;
    console.log(this.selectedYearSpans.value);
    console.log(this.selectedIndicators.value);
    console.log(this.selectedCountries.value);
    stepper.next();
  }
}
