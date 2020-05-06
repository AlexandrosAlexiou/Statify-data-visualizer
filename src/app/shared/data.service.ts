import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  serverBaseUrl = 'http://localhost:3000/api';

  getAvailableCountries(){
    const url = `${this.serverBaseUrl}/countries`;
    return fetch(url);
  }

  getAvailableIndicators(){
    const url = `${this.serverBaseUrl}/indicators`;
    return fetch(url);
  }

  getAvailableFiveYearSpans(){
    const url = `${this.serverBaseUrl}/spanfives`;
    return fetch(url);
  }

  getAvailableTenYearSpans(){
    const url = `${this.serverBaseUrl}/spantens`;
    return fetch(url);
  }

  getAvailableTwentyYearSpans(){
    const url = `${this.serverBaseUrl}/spantwenties`;
    return fetch(url);
  }

  getIndicatorCode(ind){
    const url = `${this.serverBaseUrl}/indicator_code:${ind}`;
    return fetch(url);
  }

  getCountryCode(country){
    const url = `${this.serverBaseUrl}/country_code:${country}`;
    return fetch(url);
  }

  getFinalData(country, indicatorCode, yearSpan, yearSpanType ){
    const url = `${this.serverBaseUrl}/timeline-chart:${country}+${indicatorCode}+${yearSpan}+${yearSpanType}`;
    return fetch(url);
  }


}
