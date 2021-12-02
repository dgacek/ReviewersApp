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
  private apiEndpointUrl = `${this.apiUrl.getApiUrl()}/dictionary`;

  constructor(private http: HttpClient, private apiUrl: ApiurlService) { }

  public get(type: string, id?: number): Observable<DictionaryGetUpdateDTO[]> {
    let params: HttpParams = new HttpParams;
    params.set("type", type);
    if (id != undefined)
      params.set("id", id);

    return this.http.get<DictionaryGetUpdateDTO[]>(this.apiEndpointUrl, {params: params});
  }

  public add(type: string, data: DictionaryAddDTO): Observable<DictionaryGetUpdateDTO> {
    let params: HttpParams = new HttpParams;
    params.set("type", type);

    return this.http.post<DictionaryGetUpdateDTO>(this.apiEndpointUrl, data, {params: params});
  }

  public update(type: string, data: DictionaryGetUpdateDTO): Observable<DictionaryGetUpdateDTO> {
    let params: HttpParams = new HttpParams;
    params.set("type", type);

    return this.http.put<DictionaryGetUpdateDTO>(this.apiEndpointUrl, data, {params: params});
  }

  public delete(type: string, id: number): Observable<void> {
    let params: HttpParams = new HttpParams;
    params.set("type", type);
    params.set("id", id);

    return this.http.delete<void>(this.apiEndpointUrl, {params: params});
  }

}
