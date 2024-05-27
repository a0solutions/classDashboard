import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { LoginService } from 'src/app/demo/service/login.service';
import { TokenService } from 'src/app/demo/service/token.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard {
    constructor(
        private auth: LoginService,
        private router: Router,
        private token: TokenService
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let activo: boolean = this.token.isUserLogged();
        this.token.isAdmin.next(this.token.isUserAdmin());
        if (activo) return true;
        this.auth.signOut();
        this.router.navigate(['/auth/login'], {
            queryParams: { returnTo: state.url },
        });
        return false;
    }
}
