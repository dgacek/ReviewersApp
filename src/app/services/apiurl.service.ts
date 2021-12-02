import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiurlService {

  constructor() { }

  getApiUrl(): string {
    let local = localStorage.getItem("localApi");
    let url = localStorage.getItem("apiUrl");
    if (local !== "false" || !url)
      return "http://localhost:8080";
    return url;
  }

  setLocalApi() {
    localStorage.setItem("localApi", "true");
  }

  setApiUrl(url: string) {
    localStorage.setItem("localApi", "false");
    localStorage.setItem("apiUrl", url);
  }
}
