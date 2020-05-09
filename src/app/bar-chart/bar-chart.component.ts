import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DataService } from '../shared/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { Multi, ValueKeyPair } from '../timeline-chart/timeline-chart.component';

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
interface DbKeyPair {
  year: string;
  measurement: number;
}

export interface Multi {
  name: string;
  series: ValueKeyPair[];
}

export interface ValueKeyPair{
  name: string;
  value: number;
}

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent{
  showGraph = false;
  progressBarValue = 1;
  progress = false;
  isLinear = true;
  step1 = false;
  step2 = false;
  step3 = false;
  step4 = false;
  step5 = false;
  step6 = false;
  step7 = false;
  Countries = [];
  Indicators = [];
  FiveYearSpan = [];
  TenYearSpan = [];
  TwentyYearSpan = [];
  selectedYearSpan = new FormControl();
  selectedFirstCountry = new FormControl();
  selectedSecondCountry = new FormControl();
  selectedFirstIndicator = new FormControl();
  selectedSecondIndicator = new FormControl();
  firstCountryCode: string;
  firstCountryIndicatorCode: string;
  firstCountryData: any;
  secondCountryCode: string;
  secondCountryIndicatorCode: string;
  yearSpanType: string;
  secondCountryData: any;
  GraphDataFormat: Multi[] = [];

  // Graph options
  // Graph options
  view: any[] = [1900, 800];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Year';
  yAxisLabel: string;
  showYAxisLabel = true;
  timeline = true;
  colorScheme = {
    domain: ['#e6194b', '#7417d3', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080',
      '#e6beff', '#1d999a', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', ]
  };

  constructor( private dataService: DataService, private snackBar: MatSnackBar) {}

  async getYearSpans(){
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
  }

  async getCountries(){
    await this.dataService.getAvailableCountries().then(response => response.json())
      .then(data => {
        Object.entries(data.result).forEach( entry => {
          const countriesObj = entry[1] as Countries;
          this.Countries.push(countriesObj.country_name);
        });
      }).catch(error => console.error(error));
  }

  async getIndicators(){
    await this.dataService.getAvailableIndicators().then(response => response.json())
      .then(data => {
        Object.entries(data.result).forEach( entry => {
          const indicatorsObj = entry[1] as Indicators;
          this.Indicators.push(indicatorsObj.indicator_name);
        });
      }).catch(error => console.error(error));
  }

  async getSelectionData(stepper){
    this.step1 = true;
    this.progress = true;
    await this.getYearSpans();
    // console.log(this.FiveYearSpan);
    // console.log(this.TenYearSpan);
    // console.log(this.TwentyYearSpan);
    this.progress = false;
    this.progressBarValue = 3;
    stepper.next();
  }

   async checkSelectedSpan(stepper){
    this.step2 = true;
    this.progress = true;
    if (this.selectedYearSpan.value === null){
      this.snackBar.open('Please select a year span', 'Dismiss', {
        duration: 3000,
      });
      this.step2 = false;
      this.progress = false;
      return;
     }
    await this.getCountries();
    // console.log(this.Countries);
    const diff = this.selectedYearSpan.value.split('-');
    if (diff[1] - diff[0] === 19){
      this.yearSpanType = 'twenty_yr_period';
    }else if (diff[1] - diff[0] === 9){
     this.yearSpanType = 'ten_yr_period';
    }else{
      this.yearSpanType = 'five_yr_period';
    }
    this.progress = false;
    this.progressBarValue = 15;
    stepper.next();
  }

  async checkFirstCountrySelection(stepper){
    this.step3 = true;
    this.progress = true;
    if (this.selectedFirstCountry.value === null){
      this.snackBar.open('Please select a country', 'Dismiss', {
        duration: 3000,
      });
      this.step3 = false;
      this.progress = false;
      return;
    }
    await this.dataService.getCountryCode(this.selectedFirstCountry.value).then(response => response.json())
      .then(data => {
        this.firstCountryCode = data.result[0].country_code;
      });
    await this.getIndicators();
    this.Countries = this.Countries.filter( country => country !== this.selectedFirstCountry.value);
    // console.log(this.Indicators);
    this.progress = false;
    this.progressBarValue = 30;
    stepper.next();
  }

  async checkFirstIndicatorSelection(stepper){
    this.step4 = true;
    this.progress = true;
    if (this.selectedFirstIndicator.value === null){
      this.snackBar.open('Please select an indicator', 'Dismiss', {
        duration: 3000,
      });
      this.step4 = false;
      this.progress = false;
      return;
    }
    const firstIndicatorName = this.selectedFirstIndicator.value;
    let indicatorNameFormatted = firstIndicatorName.replace(/%/g, '@');
    indicatorNameFormatted = indicatorNameFormatted.replace(/ /g, '_');
    await this.dataService.getIndicatorCode(indicatorNameFormatted).then(response => response.json())
      .then(data => {
        this.firstCountryIndicatorCode = data.result[0].indicator_code;
      });
    // this.Indicators = this.Indicators.filter( indicator => indicator !== this.selectedFirstIndicator.value);
    this.progress = false;
    this.progressBarValue = 45;
    stepper.next();
  }

  async checkSecondCountrySelection(stepper){
    this.step5 = true;
    this.progress = true;
    if (this.selectedSecondCountry.value === null){
      this.snackBar.open('Please select another country', 'Dismiss', {
        duration: 3000,
      });
      this.step5 = false;
      this.progress = false;
      return;
    }
    await this.dataService.getCountryCode(this.selectedSecondCountry.value).then(response => response.json())
      .then(data => {
        this.secondCountryCode = data.result[0].country_code;
      });
    this.progress = false;
    this.progressBarValue = 60;
    stepper.next();
  }

  async checkSecondIndicatorSelection(stepper){
    this.step6 = true;
    this.progress = true;
    if (this.selectedSecondIndicator.value === null){
      this.snackBar.open('Please select another indicator', 'Dismiss', {
        duration: 3000,
      });
      this.step6 = false;
      this.progress = false;
      return;
    }
    const secondIndicatorName = this.selectedSecondIndicator.value;
    let indicatorNameFormatted = secondIndicatorName.replace(/%/g, '@');
    indicatorNameFormatted = indicatorNameFormatted.replace(/ /g, '_');
    await this.dataService.getIndicatorCode(indicatorNameFormatted).then(response => response.json())
      .then(data => {
        this.secondCountryIndicatorCode = data.result[0].indicator_code;
      });
    this.progress = false;
    /*console.log(this.firstCountryCode,
    this.firstCountryIndicatorCode,
    this.secondCountryCode,
    this.secondCountryIndicatorCode,
    this.selectedYearSpan.value,
    this.yearSpanType);*/
    this.progressBarValue = 75;
    stepper.next();
  }

  async createGraph(){
    this.step7 = true;
    this.progress = true;
    console.log(this.firstCountryCode, this.selectedFirstIndicator.value);
    await this.dataService
      .getFinalData(this.firstCountryCode, this.firstCountryIndicatorCode, this.selectedYearSpan.value, this.yearSpanType)
      .then(response => response.json()).then(data => {
        this.firstCountryData = data.result;
        const result = data.result;
        Object.entries(result).forEach( entry => {
          let graphData: Multi;
          const seriesArray: ValueKeyPair[] = [];
          const spansObj = entry[1] as DbKeyPair;
          const tempKeyPair: ValueKeyPair =
            ({name: String(this.selectedFirstCountry.value + '_' + this.selectedFirstIndicator.value), value: spansObj.measurement});
          seriesArray.push(tempKeyPair);
          graphData = ({name: String(spansObj.year), series: seriesArray});
          this.GraphDataFormat.push(graphData);
        });
      });

    console.log(this.secondCountryCode, this.selectedSecondIndicator.value);
    await this.dataService
      .getFinalData(this.secondCountryCode, this.secondCountryIndicatorCode, this.selectedYearSpan.value, this.yearSpanType)
      .then(response => response.json()).then(data => {
        this.secondCountryData = data.result;
        const result = data.result;
        Object.entries(result).forEach( entry => {
          let graphData: Multi;
          const seriesArray: ValueKeyPair[] = [];
          const spansObj = entry[1] as DbKeyPair;
          const tempKeyPair: ValueKeyPair =
            ({name: String(this.selectedSecondCountry.value + '_' + this.selectedSecondIndicator.value), value: spansObj.measurement});
          seriesArray.push(tempKeyPair);
          graphData = ({name: String(spansObj.year), series: seriesArray});
          this.GraphDataFormat.push(graphData);
        });
      });
    console.log(this.GraphDataFormat);
    // console.log(this.firstCountryData);
    // console.log(this.secondCountryData);
    this.progressBarValue = 100;
    this.progress = false;
    this.showGraph = true;
  }
}
