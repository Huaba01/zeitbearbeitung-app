import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private environment = 'pasotest';
  private usersUrl = '/api/users';
  private presencesUrl = '/api/user/presences';
  private profileUrl = '/api/profile'; 

  constructor(private http: HttpClient) {}

  private getApiKey(): string {
    const apiKey = localStorage.getItem('apiKey');
    return apiKey ? apiKey : '';
  }

  private createHeaders(): HttpHeaders {
    const apiKey = this.getApiKey();
    return new HttpHeaders({
      Authorization: apiKey,
      'X-ENVIRONMENT': this.environment,
      accept: 'application/json',
      'Content-Type': 'application/json',
    });
  }

  private formatTime(time: string): string {
    if (time.length === 5) {
      return time + ':00';
    }
    return time;
  }
  getProfile(): Observable<any> {
    const headers = this.createHeaders();
    return this.http.get(this.profileUrl, { headers });
  }
  getUsers(): Observable<any> {
    const headers = this.createHeaders();
    return this.http.get(this.usersUrl, { headers });
  }
  getPresences(userId: number): Observable<any> {
    const headers = this.createHeaders();
    const url = `${this.presencesUrl}?user_id=${userId}`;
    return this.http.get(url, { headers });
  }
  updatePresence(presence: any): Observable<any> {
    const headers = this.createHeaders();

    const body = {
      date: presence.date,
      from: this.formatTime(presence.from),
      to: this.formatTime(presence.to),
      is_home_office: presence.is_home_office,
    };
    console.log('Gesendeter Request-Body:', body);
    const updateUrlWithId = `${this.presencesUrl}/${presence.id}`;
    return this.http.put(updateUrlWithId, body, { headers });
  }
}
