import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { LoginService } from '../../../service/login.service';
import { TokenService } from 'src/app/demo/service/token.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [
        `
            :host ::ng-deep .pi-eye,
            :host ::ng-deep .pi-eye-slash {
                transform: scale(1.6);
                margin-right: 1rem;
                color: var(--primary-color) !important;
            }
        `,
    ],
})
export class LoginComponent {
    // valCheck: string[] = ['remember'];
    password!: string;
    user: string;
    message: string;
    constructor(
        public layoutService: LayoutService,
        private login: LoginService,
        private token: TokenService,
        private route: Router
    ) {}

    loginUser(data: NgForm): void {
        !data.valid
            ? alert(
                  "All fields most be correctly filled. Write a valid email address and don't let empty the password field."
              )
            : this.sendValidation(data.value);
    }
    sendValidation(data: object): void {
        this.login.postLogin(data).subscribe({
            next: this.openSession.bind(this),
            error: console.log.bind(this),
        });
    }
    openSession(x: string): void {
        if (x) {
            this.token.setToken(x);
            this.route.navigate(['/']);
        } else {
            this.message = 'Sorry your username and password does not match.';
        }
    }
}
