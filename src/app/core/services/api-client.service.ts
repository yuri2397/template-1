import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { inject } from "@angular/core";
interface Params {
  [key: string]: string | string[] | number | boolean | undefined;
}
export class ApiClientService {
  private readonly API_URL = environment.apiUrl;
  private _baseUrl = '';
  private http = inject(HttpClient);
  constructor() { }

  set baseUrl(value: string) {
    if (value.endsWith('/')) {
      value = value.slice(0, -1);
    }
    this._baseUrl = value;
  }

  get baseUrl() {
    return this._baseUrl;
  }

  /**
   * CRUD
   */

  get(endpoint: string, params: any) {
    return this.http.get(`${this.API_URL}/${this.baseUrl}/${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      params: params
    });
  }

  post(endpoint: string, data: any, params: any = {}) {
    return this.http.post(`${this.API_URL}/${this.baseUrl}/${endpoint}`, data, { params });
  }

  put(endpoint: string, data: any, params: any = {}) {
    return this.http.put(`${this.API_URL}/${this.baseUrl}/${endpoint}`, data, { params });
  }

  delete(endpoint: string, params: any = {}) {
    return this.http.delete(`${this.API_URL}/${this.baseUrl}/${endpoint}`, { params });
  }

  /**
   * LOCAL STORAGE
   */

  setItem(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getItem(key: string) {
    return JSON.parse(localStorage.getItem(key) || '{}');
  }

  removeItem(key: string) {
    localStorage.removeItem(key);
  }

  clear() {
    localStorage.clear();
  }

  /**
   * SESSION STORAGE
   */

  setSessionItem(key: string, value: any) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  getSessionItem(key: string) {
    return JSON.parse(sessionStorage.getItem(key) || '{}');
  }

  removeSessionItem(key: string) {
    sessionStorage.removeItem(key);
  }

  clearSession() {
    sessionStorage.clear();
  }

  /**
   *
   */

  setToken(token: string) {
    this.setItem('token', token);
  }

  getToken() {
    return this.getItem('token');
  }

  removeToken() {
    this.removeItem('token');
  }

  /**
   *
   */

  setUser(user: any) {
    this.setItem('user', user);
  }

  getUser() {
    return this.getItem('user');
  }

  removeUser() {
    this.removeItem('user');
  }

  // app version

  getAppVersion() {
    return this.getItem('appVersion');
  }

  setAppVersion(version: string) {
    this.setItem('appVersion', version);
  }

}
