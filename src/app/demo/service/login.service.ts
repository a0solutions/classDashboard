import { HttpClient } from '@angular/common/http';
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
        return this.http.post(this.url + '?context=admin', data, {
            responseType: 'text',
        });
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
        let token = this.token.getValidateToken();
        return this.http.get(
            this.url + '?context=admin&action=getAll&validate=' + token
        );
    }
}
