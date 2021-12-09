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

  constructor(private http: HttpClient, private apiUrl: ApiurlService) { }

  private getApiEndpointUrl(): string {
    return `${this.apiUrl.getApiUrl()}/faculties`;
  }

  public get(id?: number): Observable<FacultyGetUpdateDTO[]> {
    let params: HttpParams = new HttpParams;
    if (id)
      params = new HttpParams().set("id", id);

    return this.http.get<FacultyGetUpdateDTO[]>(this.getApiEndpointUrl(), {params: params});
  }

  public add(data: FacultyAddDTO): Observable<FacultyGetUpdateDTO> {
    return this.http.post<FacultyGetUpdateDTO>(this.getApiEndpointUrl(), data);
  }

  public update(data: FacultyGetUpdateDTO): Observable<FacultyGetUpdateDTO> {
    return this.http.put<FacultyGetUpdateDTO>(this.getApiEndpointUrl(), data);
  }

  public delete(id: number): Observable<void> {
    let params: HttpParams = new HttpParams;
    if (id)
      params = new HttpParams().set("id", id);
    
    return this.http.delete<void>(this.getApiEndpointUrl(), {params: params});
  }
}
