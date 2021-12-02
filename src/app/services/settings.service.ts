import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor() { }

  getSettingsValue(key: string) :string | null {
    return localStorage.getItem(key);
  }

  setSettingsValue(key: string, value: string) {
    localStorage.setItem(key, value);
  }
}
