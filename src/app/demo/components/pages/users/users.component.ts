import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { take } from 'rxjs';
import { TokenService } from 'src/app/demo/service/token.service';
import { urls } from 'src/environments/environment';
import * as XLSX from 'xlsx';
interface Users {
    id: string;
    name: string;
    surname: string;
    email: string;
    phone: string;
    company: string;
    profession: string;
    userType: string;
    date: string;
}
@Component({
    templateUrl: './users.component.html',
    providers: [MessageService],
    styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
    url: string = urls.urlusers;
    users: Users[] = [];
    selectedColumns: Users[] = [];
    selectedUsers: Users[] = [];
    cols: any[] = [];
    userDialog: boolean = false;
    activeCamp: boolean[] = [];
    isAdmin: any;
    newsLetter: any[] = [];
    constructor(
        private token: TokenService,
        private http: HttpClient,
        private confirmation: ConfirmationService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.token.isAdmin.subscribe((x) => {
            this.isAdmin = x;
        });
        this.getUsers();

        this.cols = [
            { field: 'id', header: 'ID' },
            { field: 'name', header: 'Name' },
            { field: 'surname', header: 'Surname' },
            { field: 'email', header: 'Email' },
            { field: 'phone', header: 'Phone' },
            { field: 'company', header: 'Company' },
            { field: 'profession', header: 'Profession' },
            { field: 'userType', header: 'User Role' },
            { field: 'date', header: 'Registered' },
        ];
    }
    getUsers() {
        let token = this.token.getValidateToken();
        this.http
            .get(this.url + '?validate=' + token)
            .pipe(take(1))
            .subscribe((x: Users[]) => {
                this.users = x;
            });
        this.http
            .get(this.url + '?validate=' + token + '&action=newsLetter')
            .pipe(take(1))
            .subscribe((x: any[]) => {
                this.newsLetter = x;
            });
    }
    onGlobalFilter(table: Table, event: Event): void {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }
    deleteUser(id: string) {
        let token = this.token.getValidateToken();
        this.http
            .delete(this.url + '?validate=' + token + '&id=' + id)
            .subscribe((x) => {
                x ? this.confirmed() : this.rejected();
            });
    }
    confirmed(): void {
        this.messageService.add({
            severity: 'info',
            summary: 'Confirmed',
            detail: 'You have accepted',
        });
    }
    rejected(): void {
        this.messageService.add({
            severity: 'error',
            summary: 'Rejected',
            detail: 'You have rejected',
        });
    }
    updateUserRole(newRole: string, userId: string): void {
        let token = this.token.getValidateToken();
        this.http
            .put(this.url + '?validate=' + token + '&action=role', {
                ID: userId,
                newRole: newRole,
            })
            .subscribe((x) => {
                x ? this.confirmed() : this.rejected();
            });
    }
    confirm(userId: string, newRole?: string): void {
        this.confirmation.confirm({
            key: 'confirm',
            target: event.target || new EventTarget(),
            message: 'Are you sure that you want to proceed?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                newRole == undefined
                    ? this.deleteUser(userId)
                    : this.updateUserRole(newRole, userId);
            },
            reject: () => {
                this.getUsers();
                this.rejected();
            },
        });
    }

    exportExcel(array: any, name: string) {
        const fileName = name + '.xlsx';

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(array);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'test');

        XLSX.writeFile(wb, fileName);
    }
}
