import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserChangePasswordDTO } from 'src/app/shared/types/dto/user/UserChangePasswordDTO';
import { ApiurlService } from '../apiurl.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private apiUrl: ApiurlService) { }

  private getApiEndpointUrl(): string {
    return `${this.apiUrl.getApiUrl()}/users`;
  }
  
  public changePassword(data: UserChangePasswordDTO): Observable<void> {
    return this.http.put<void>(this.getApiEndpointUrl()+"/changepwd", data);
  }
}
