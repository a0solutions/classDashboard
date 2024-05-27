import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { urls } from 'src/environments/environment';
import { TokenService } from './token.service';
import { Notification } from '../api/customer';

@Injectable()
export class NotificationsService {
    url: string = urls.urlContact;
    constructor(private http: HttpClient, private tokenService: TokenService) {}
    getAllNotifications(): Observable<object> {
        let token = this.tokenService.getValidateToken();
        return this.http.get(this.url + '?validate=' + token);
    }
    answered(notification: Notification): Observable<object> {
        let token = this.tokenService.getValidateToken();
        return this.http.put(this.url + '?validate=' + token, notification);
    }
}
