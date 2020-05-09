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
  series: BubbleData[];
}
export interface ValueKeyPair{
  year: number;
  measurement: number;
}

export interface BubbleData{
  name: string;
  x: string;
  y: number;
  r: number;
}
@Component({
  selector: 'app-scatter-plot',
  templateUrl: './scatter-plot.component.html',
  styleUrls: ['./scatter-plot.component.css']
})
export class ScatterPlotComponent  {
  progressBarValue = 1;
  progress = false;
  isLinear = true;
  step1 = false;
  step2 = false;
  step3 = false;
  step4 = false;
  showGraph = false;
  Countries = [];
  Indicators = [];
  FiveYearSpan = [];
  TenYearSpan = [];
  TwentyYearSpan = [];
  selectedCountries = new FormControl();
  selectedIndicators = new FormControl();
  selectedYearSpan = new FormControl();
  GraphDataFormat: Multi[] = [];
  view: any[] = [1800, 800];


  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  yAxisLabel = '';
  showYAxisLabel = true;
  xAxisLabel = 'Years';
  maxRadius = 20;
  minRadius = 5;
  yScaleMin = 70;
  yScaleMax = 85;

  colorScheme = {
    domain: ['#e6194b', '#7417d3', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080',
      '#e6beff', '#1d999a', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', ]
  };

  constructor(private dataService: DataService, private snackBar: MatSnackBar) {}

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
    this.progress = false;
    stepper.next();
  }

  async getIndicators(stepper){
    this.step2 = true;
    this.progress = true;
    if (this.selectedCountries.value === null || this.selectedCountries.value.length === 0 ){
      this.snackBar.open('Please select one Country', 'Dismiss', {
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

    this.progress = false;
    stepper.next();
  }

  async getYearSpans(stepper){
    this.step3 = true;
    this.progress = true;
    if (this.selectedIndicators.value === null || this.selectedIndicators.value.length === 0){
      this.snackBar.open('Please Indicators', 'Dismiss', {
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
    const country = this.selectedCountries.value;
    const yearSpan = String(this.selectedYearSpan.value);

    ///////////////////////////////////////
    //
    // Testing inputs before drawing graph
    //
    ///////////////////////////////////////

    console.log(this.selectedCountries.value);
    console.log(this.selectedIndicators.value);
    console.log(this.selectedYearSpan.value);
    console.log(yearSpanType);
    console.log(this.selectedIndicators.value.length);


    let countryCode: string;
    let indicatorCode: string;

    await this.dataService.getCountryCode(country)
      .then(response => response.json()).then(data => {
        countryCode = data.result[0].country_code;
      });
    console.log(countryCode);
    const indicatorsNumber = this.selectedIndicators.value.length;
    for (let i = 0; i < indicatorsNumber; i++){
      let indicatorNameFormattedForUrl: string;
      indicatorNameFormattedForUrl = this.selectedIndicators.value[i].replace(/ /g, '_');
      indicatorNameFormattedForUrl = this.selectedIndicators.value[i].replace(/%/g, '@');
      await this.dataService.getIndicatorCode(indicatorNameFormattedForUrl)
        .then(response => response.json()).then(data => {
          indicatorCode = data.result[0].indicator_code;
        });

      await this.dataService.getFinalData(countryCode, indicatorCode, yearSpan, yearSpanType)
        .then(response => response.json()).then(data => {
          const result = data.result;
          let graphData: Multi;
          const seriesArray: BubbleData [] = [];
          Object.entries(result).forEach(entry => {
            const temp = entry[1] as ValueKeyPair;
            const tempbubble: BubbleData = ({name: String(temp.year), x: String(temp.year), y: temp.measurement, r: temp.measurement});
            seriesArray.push(tempbubble);

          });
          graphData = ({name: this.selectedIndicators.value[i], series: seriesArray});
          this.GraphDataFormat.push(graphData);
        });

    }
    this.yAxisLabel = this.selectedCountries.value;
    this.progress = false;
    stepper.next();
  }

  createGraph(){
    this.showGraph = true;
  }

}
