import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8080/';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  /**
   * @param  {HttpClient} privatehttp
   */
  constructor(private http: HttpClient) {}

  /**
   * @returns Observable
   */
  public getNumbersPayloadData(): Observable<any> {
    return this.http.get(API_URL + 'numberPayload', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      responseType: 'text',
    });
  }

  /**
   * @returns Observable
   */
  public getResultPayloadData(): Observable<any> {
    return this.http.get(API_URL + 'results', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      responseType: 'text',
    });
  }
}
