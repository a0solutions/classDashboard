import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from './service/app.layout.service';
import { LoginService } from '../demo/service/login.service';
import { TokenService } from '../demo/service/token.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
})
export class AppTopBarComponent {
    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;
    name: string;
    constructor(
        public layoutService: LayoutService,
        private user: LoginService,
        private token: TokenService
    ) {
        this.name = this.token.getUserName();
    }
    logOut(): void {
        this.user.signOut();
    }
}
