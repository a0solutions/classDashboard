import { HttpClient, HttpParams } from '@angular/common/http';
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
        const params = new HttpParams().set(
            'validate',
            this.tokenService.getValidateToken()
        );
        return this.http.get(this.url, { params });
    }
    answered(notification: Notification): Observable<object> {
        const params = new HttpParams().set(
            'validate',
            this.tokenService.getValidateToken()
        );
        return this.http.put(this.url, notification, { params });
    }
}
