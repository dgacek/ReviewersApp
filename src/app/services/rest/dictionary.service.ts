import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DictionaryAddDTO } from 'src/app/shared/types/dto/dictionary/DictionaryAddDTO';
import { DictionaryGetUpdateDTO } from 'src/app/shared/types/dto/dictionary/DictionaryGetUpdateDTO';
import { ApiurlService } from '../apiurl.service';

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {

  constructor(private http: HttpClient, private apiUrl: ApiurlService) { }

  private getApiEndpointUrl(): string {
    return `${this.apiUrl.getApiUrl()}/dictionary`;
  }

  public get(type: string, id?: number): Observable<DictionaryGetUpdateDTO[]> {
    let params;
    if (id)
      params = new HttpParams().set("id", id).set("type", type);
    else 
      params = new HttpParams().set("type", type);

    return this.http.get<DictionaryGetUpdateDTO[]>(this.getApiEndpointUrl(), {params: params});
  }

  public add(type: string, data: DictionaryAddDTO): Observable<DictionaryGetUpdateDTO> {
    let params: HttpParams = new HttpParams().set("type", type);

    return this.http.post<DictionaryGetUpdateDTO>(this.getApiEndpointUrl(), data, {params: params});
  }

  public update(type: string, data: DictionaryGetUpdateDTO): Observable<DictionaryGetUpdateDTO> {
    let params: HttpParams = new HttpParams().set("type", type);

    return this.http.put<DictionaryGetUpdateDTO>(this.getApiEndpointUrl(), data, {params: params});
  }

  public delete(type: string, id: number): Observable<void> {
    let params;
    if (id)
      params = new HttpParams().set("id", id).set("type", type);
    else 
      params = new HttpParams().set("type", type);

    return this.http.delete<void>(this.getApiEndpointUrl(), {params: params});
  }

}
