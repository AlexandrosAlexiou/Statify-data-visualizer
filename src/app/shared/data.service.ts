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

  getAvailableYearSpans(){
    const url = `${this.serverBaseUrl}/spans`;
    return fetch(url);
  }
}

