import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private urlAPi = 'http://localhost:5264/api/services';
  private urlAPiTurnos = 'http://localhost:5264/api/shifts';

  constructor(private http: HttpClient) { }

  public getDataService(): Observable<any> {
    return this.http.get<any>(this.urlAPi);
  }

  public generateShifts(data: any): Observable<any>{
    return this.http.post<any>(this.urlAPiTurnos, data).pipe(delay(2000));
  }
}
