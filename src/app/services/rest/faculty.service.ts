import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FacultyAddDTO } from 'src/app/shared/types/dto/faculty/FacultyAddDTO';
import { FacultyGetUpdateDTO } from 'src/app/shared/types/dto/faculty/FacultyGetUpdateDTO';
import { ApiurlService } from '../apiurl.service';

@Injectable({
  providedIn: 'root'
})
export class FacultyService {
  private apiEndpointUrl = `${this.apiUrl.getApiUrl()}/faculties`;

  constructor(private http: HttpClient, private apiUrl: ApiurlService) { }

  public get(id?: number): Observable<FacultyGetUpdateDTO[]> {
    let params: HttpParams = new HttpParams;
    if (id != undefined)
      params.set("id", id);

    return this.http.get<FacultyGetUpdateDTO[]>(this.apiEndpointUrl, {params: params});
  }

  public add(data: FacultyAddDTO): Observable<FacultyGetUpdateDTO> {
    return this.http.post<FacultyGetUpdateDTO>(this.apiEndpointUrl, data);
  }

  public update(data: FacultyGetUpdateDTO): Observable<FacultyGetUpdateDTO> {
    return this.http.put<FacultyGetUpdateDTO>(this.apiEndpointUrl, data);
  }

  public delete(id: number): Observable<void> {
    let params: HttpParams = new HttpParams;
    params.set("id", id);
    
    return this.http.delete<void>(this.apiEndpointUrl, {params: params});
  }
}
