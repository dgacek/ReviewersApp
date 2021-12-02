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
  private apiEndpointUrl = `${this.apiUrl.getApiUrl()}/login`;

  constructor(private http: HttpClient, private apiUrl: ApiurlService) { }

  public login(data: AuthRequestDTO): Observable<AuthResponseDTO> {
    return this.http.post<AuthResponseDTO>(this.apiEndpointUrl, data);
  }
}
