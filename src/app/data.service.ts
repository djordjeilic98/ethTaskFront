import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  sendDataToBackend(data: any): any{
    return this.http.post<any>(environment.apiUrl + '/api/getdatafromwebpage/', data);
  }

  getEthValueOfSpecificDate(data: any): any{
    return this.http.post<any>(environment.apiUrl + '/api/getEthBalanceInSomeDay/', data);
  }
}
