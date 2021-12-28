import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ThesisAddDTO } from 'src/app/shared/types/dto/thesis/ThesisAddDTO';
import { ThesisGetDTO } from 'src/app/shared/types/dto/thesis/ThesisGetDTO';
import { ThesisUpdateDTO } from 'src/app/shared/types/dto/thesis/ThesisUpdateDTO';
import { ApiurlService } from '../apiurl.service';

@Injectable({
  providedIn: 'root'
})
export class ThesisService {
  
  constructor(private http: HttpClient, private apiUrl: ApiurlService) { }

  private getApiEndpointUrl(): string {
    return `${this.apiUrl.getApiUrl()}/theses`;
  }

  public get(id?: number): Observable<ThesisGetDTO[]> {
    let params: HttpParams = new HttpParams;
    if (id)
      params = new HttpParams().set("id", id);

    return this.http.get<ThesisGetDTO[]>(this.getApiEndpointUrl(), {params: params});
  }

  public add(data: ThesisAddDTO): Observable<ThesisGetDTO> {
    return this.http.post<ThesisGetDTO>(this.getApiEndpointUrl(), data);
  }

  public update(data: ThesisUpdateDTO): Observable<ThesisGetDTO> {
    return this.http.put<ThesisGetDTO>(this.getApiEndpointUrl(), data);
  }

  public delete(id: number): Observable<void> {
    let params: HttpParams = new HttpParams;
    if (id)
      params = new HttpParams().set("id", id);
    
    return this.http.delete<void>(this.getApiEndpointUrl(), {params: params});
  }

  public importExcel(file: File): Observable<void> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<void>(this.getApiEndpointUrl()+"/import", formData);
  }

  public exportToExcel(): void {
    this.http.get(this.getApiEndpointUrl()+"/export", { responseType: 'blob' as 'json' }).subscribe({
      next: (response: any) => {
        let blob = new Blob([response], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        let url = window.URL.createObjectURL(blob);
        window.open(url, "_blank", "noreferrer");
      }
    })
  }
}
