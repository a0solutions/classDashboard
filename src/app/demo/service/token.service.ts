import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
    providedIn: 'root',
})
export class TokenService {
    token: string = '';
    isLogged: BehaviorSubject<boolean> = new BehaviorSubject(false);
    verify = new JwtHelperService();
    isAdmin: BehaviorSubject<boolean> = new BehaviorSubject(false);
    constructor() {
        this.token = <string>localStorage.getItem('CDHtokenAdmin');
    }
    isUserLogged(): boolean {
        if (this.getUserId() == '') return false;
        return true;
    }
    logOut(): void {
        localStorage.removeItem('CDHtokenAdmin');
        this.isLogged.next(false);
    }
    getUserId(): string {
        this.getToken();
        if (!this.verify.isTokenExpired(this.token)) {
            let info = this.verify.decodeToken(this.token);
            return info.iss;
        } else {
            return '';
        }
    }
    private getToken(): string {
        this.token = <string>localStorage.getItem('CDHtokenAdmin');
        return this.token;
    }
    tokenExpired(): boolean {
        return this.verify.isTokenExpired(this.token);
    }
    setToken(token: string): void {
        localStorage.setItem('CDHtokenAdmin', token);
        this.isLogged.next(true);
    }
    getValidateToken(): string {
        return this.getToken();
    }
    getUserName(): string {
        this.getToken();
        if (!this.verify.isTokenExpired(this.token)) {
            let info = this.verify.decodeToken(this.token);
            return info.user_name;
        } else {
            return '';
        }
    }
    isUserAdmin(): boolean {
        this.getToken();
        if (!this.verify.isTokenExpired(this.token)) {
            let info = this.verify.decodeToken(this.token);
            if (info.role == 'admin') return true;
            return false;
        } else {
            return false;
        }
    }
}
