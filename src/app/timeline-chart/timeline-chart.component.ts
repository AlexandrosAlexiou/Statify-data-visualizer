import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DataService } from '../shared/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Countries {
  country_name: string;
}
interface Indicators {
  indicator_name: string;
}
interface YearSpans {
  five_yr_period: string;
  ten_yr_period?: string;
  twenty_yr_period?: string;
}

export interface Multi {
  name: string;
  series: ValueKeyPair[];
}

export interface ValueKeyPair{
  name: string;
  value: number;
}

interface DbKeyPair {
  year: number;
  measurement: number;
}
@Component({
  selector: 'app-timeline-chart',
  templateUrl: './timeline-chart.component.html',
  styleUrls: ['./timeline-chart.component.css']
})
export class TimelineChartComponent{
  showGraph = false;
  progressBarValue = 1;
  progress = false;
  isLinear = true;
  step1 = false;
  step2 = false;
  step3 = false;
  step4 = false;
  step5 = false;
  Countries = [];
  Indicators = [];
  FiveYearSpan = [];
  TenYearSpan = [];
  TwentyYearSpan = [];
  selectedCountries = new FormControl();
  selectedIndicators = new FormControl();
  selectedYearSpan = new FormControl();
  GraphDataFormat: Multi[] = [];

  // Graph options
  view: any[] = [1900, 1000];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Year';
  showYAxisLabel = true;
  timeline = true;
  colorScheme = {
    domain: ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080',
      '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', ]
  };
  yAxisLabel: string;

  constructor( private dataService: DataService, private snackBar: MatSnackBar) {}

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
    if (this.selectedCountries.value === null || this.selectedCountries.value.length === 0 ){
      this.snackBar.open('Please select one or more Countries', 'Dismiss', {
        duration: 3000,
      });
      this.progress = false;
      this.step2 = false;
      return;
    }
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
    if (this.selectedIndicators.value === null || this.selectedIndicators.value.length === 0){
      this.snackBar.open('Please select one or more Indicators', 'Dismiss', {
        duration: 3000,
      });
      this.progress = false;
      this.step3 = false;
      return;
    }
    this.progressBarValue = 66;
    await this.dataService.getAvailableFiveYearSpans().then(response => response.json())
      .then(data => {
        Object.entries(data.result).forEach( entry => {
          const spansObj = entry[1] as YearSpans;
          this.FiveYearSpan.push(spansObj.five_yr_period);
        });
      }).catch(error => console.error(error));
    await this.dataService.getAvailableTenYearSpans().then(response => response.json())
      .then(data => {
        Object.entries(data.result).forEach( entry => {
          const spansObj = entry[1] as YearSpans;
          this.TenYearSpan.push(spansObj.ten_yr_period);
        });
      }).catch(error => console.error(error));
    await this.dataService.getAvailableTwentyYearSpans().then(response => response.json())
      .then(data => {
        Object.entries(data.result).forEach( entry => {
          const spansObj = entry[1] as YearSpans;
          this.TwentyYearSpan.push(spansObj.twenty_yr_period);
        });
      }).catch(error => console.error(error));
    this.progress = false;
    stepper.next();
  }

  async prepareData(stepper){
    this.progress = true;
    this.step4 = true;
    if (this.selectedYearSpan.value === null){
      this.snackBar.open('Please select a years span', 'Dismiss', {
        duration: 3000,
      });
      this.step4 = false;
      this.progress = false;
      return;
    }
    this.progressBarValue = 100;
    const diff = this.selectedYearSpan.value.split('-');
    let yearSpanType: string;
    if (diff[1] - diff[0] === 19){
      yearSpanType = 'twenty_yr_period';
    }else if (diff[1] - diff[0] === 9){
      yearSpanType = 'ten_yr_period';
    }else{
      yearSpanType = 'five_yr_period';
    }
    const countries = this.selectedCountries.value;
    const indicatorName = String(this.selectedIndicators.value);
    const yearSpan = String(this.selectedYearSpan.value);
    // console.log(countries);
    let indicatorCode: string;
    let indicatorNameFormattedForUrl: string;
    indicatorNameFormattedForUrl = indicatorName.replace(/%/g, '%25');
    await this.dataService.getIndicatorCode(indicatorNameFormattedForUrl)
      .then(response => response.json()).then(data => {
        indicatorCode = data.result[0].indicator_code;
      } );
    for ( const country of countries) {
      let countryCode: string;
      await this.dataService.getCountryCode(country)
        .then(response => response.json()).then(data => {
          countryCode = data.result[0].country_code;
        });
      await this.dataService.getFinalData(countryCode, indicatorCode, yearSpan, yearSpanType)
        .then(response => response.json()).then(data => {
          const result = data.result;
          let graphData: Multi;
          const seriesArray: ValueKeyPair[] = [];
          Object.entries(result).forEach(entry => {
            const spansObj = entry[1] as DbKeyPair;
            const tempKeyPair: ValueKeyPair = ({name: String(spansObj.year), value: spansObj.measurement});
            seriesArray.push(tempKeyPair);
          });
          graphData = ({name: country, series: seriesArray});
          this.GraphDataFormat.push(graphData);
        });
    }
    console.log(this.GraphDataFormat);
    this.yAxisLabel = indicatorName;
    this.progress = false;
    stepper.next();
  }

  async createGraph(){
    this.step5 = true;
    this.showGraph = true;
  }
}
