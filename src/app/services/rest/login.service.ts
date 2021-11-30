import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthRequestDTO } from 'src/app/shared/types/dto/auth/AuthRequestDTO';
import { AuthResponseDTO } from 'src/app/shared/types/dto/auth/AuthResponseDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiEndpointUrl = `${environment.apiUrl}/login`;

  constructor(private http: HttpClient) { }

  public login(data: AuthRequestDTO): Observable<AuthResponseDTO> {
    return this.http.post<AuthResponseDTO>(this.apiEndpointUrl, data);
  }
}
