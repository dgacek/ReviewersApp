import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReviewerAddDTO } from 'src/app/shared/types/dto/reviewer/ReviewerAddDTO';
import { ReviewerGetDTO } from 'src/app/shared/types/dto/reviewer/ReviewerGetDTO';
import { ReviewerUpdateDTO } from 'src/app/shared/types/dto/reviewer/ReviewerUpdateDTO';
import { ApiurlService } from '../apiurl.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewerService {
  private apiEndpointUrl = `${this.apiUrl.getApiUrl()}/reviewers`;

  constructor(private http: HttpClient, private apiUrl: ApiurlService) { }

  public get(id?: number): Observable<ReviewerGetDTO[]> {
    let params: HttpParams = new HttpParams;
    if (id != undefined)
      params.set("id", id);

    return this.http.get<ReviewerGetDTO[]>(this.apiEndpointUrl, {params: params});
  }

  public add(data: ReviewerAddDTO): Observable<ReviewerGetDTO> {
    return this.http.post<ReviewerGetDTO>(this.apiEndpointUrl, data);
  }

  public update(data: ReviewerUpdateDTO): Observable<ReviewerGetDTO> {
    return this.http.put<ReviewerGetDTO>(this.apiEndpointUrl, data);
  }

  public delete(id: number): Observable<void> {
    let params: HttpParams = new HttpParams;
    params.set("id", id);
    
    return this.http.delete<void>(this.apiEndpointUrl, {params: params});
  }
}
