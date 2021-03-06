import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataFromBackModel } from '../models/data.model';

@Injectable({
  providedIn: 'root'
})
export class TemperatureService {
  private tempUrl = '/api/temp';
  private statUrl = '/api/statistiques';


  constructor(private http: HttpClient) { }

  getTemperature(): Observable<DataFromBackModel[]> {
    return this.http.get<DataFromBackModel[]>(this.tempUrl);
  }


  getStatistiques(data: { dateDebut: string, dateFin: string }): Observable<any> {
    return this.http.post(this.statUrl, data);
  }

  // Error handling
  private error(error: any) {
    let message = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(message);
  }
}
