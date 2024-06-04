import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from 'src/app/demo/service/token.service';
import { urls } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class LoginService {
    url: string = urls.urlusers;
    constructor(
        private http: HttpClient,
        private token: TokenService,
        private router: Router
    ) {}
    postLogin(data: object): Observable<string> {
        const params = new HttpParams().set('context', 'admin');
        return this.http.post(this.url, data, { responseType: 'text', params });
    }

    signOut(param?: string): void {
        this.token.logOut();
        this.router.navigate(['/auth/login'], {
            queryParams: { returnTo: param },
        });
    }
    getUserName(): string {
        return this.token.getUserName();
    }
    getAllUsers(): Observable<object> {
        const params = new HttpParams()
            .set('validate', this.token.getValidateToken())
            .set('context', 'admin')
            .set('action', 'getAll');
        return this.http.get(this.url, { params });
    }
}
