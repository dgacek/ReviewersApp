import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ThesisAddDTO } from 'src/app/shared/types/dto/thesis/ThesisAddDTO';
import { ThesisGetDTO } from 'src/app/shared/types/dto/thesis/ThesisGetDTO';
import { ThesisUpdateDTO } from 'src/app/shared/types/dto/thesis/ThesisUpdateDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ThesisService {
  private apiEndpointUrl = `${environment.apiUrl}/theses`;

  constructor(private http: HttpClient) { }

  public get(id?: number): Observable<ThesisGetDTO[]> {
    let params: HttpParams = new HttpParams;
    if (id != undefined)
      params.set("id", id);

    return this.http.get<ThesisGetDTO[]>(this.apiEndpointUrl, {params: params});
  }

  public add(data: ThesisAddDTO): Observable<ThesisGetDTO> {
    return this.http.post<ThesisGetDTO>(this.apiEndpointUrl, data);
  }

  public update(data: ThesisUpdateDTO): Observable<ThesisGetDTO> {
    return this.http.put<ThesisGetDTO>(this.apiEndpointUrl, data);
  }

  public delete(id: number): Observable<void> {
    let params: HttpParams = new HttpParams;
    params.set("id", id);
    
    return this.http.delete<void>(this.apiEndpointUrl, {params: params});
  }
}
