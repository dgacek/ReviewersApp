import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthRequestDTO } from 'src/app/shared/types/dto/auth/AuthRequestDTO';
import { AuthResponseDTO } from 'src/app/shared/types/dto/auth/AuthResponseDTO';
import { ApiurlService } from '../apiurl.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private apiUrl: ApiurlService) { }

  private getApiEndpointUrl(): string {
    return `${this.apiUrl.getApiUrl()}/login`;
  }

  public login(data: AuthRequestDTO): Observable<AuthResponseDTO> {
    return this.http.post<AuthResponseDTO>(this.getApiEndpointUrl(), data);
  }
}
