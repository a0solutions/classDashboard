import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Promotion } from 'src/app/demo/api/customer';
import { NotificationsService } from 'src/app/demo/service/notifications.service';
import { TokenService } from 'src/app/demo/service/token.service';
import { urls } from 'src/environments/environment';

@Component({
    templateUrl: './promotions.component.html',
    providers: [MessageService],
    styleUrls: ['./promotions.component.css'],
})
export class PromotionsComponent implements OnInit {
    url: string = urls.urlContact;
    notifications: Notification[] = [];
    selectedColumns: any[] = [];
    selectedNotifications: Notification[] = [];
    cols: any[] = [];
    notificationDialog: boolean = false;

    //*********************** Notifications Properties */
    fullname: string = '';
    subject: string = '';
    topic: string = '';
    email: string = '';
    textmessage: string = '';
    date: string = '';
    promotionDialog: boolean = false;
    promotionSelected: Promotion = <Promotion>{};
    constructor() {}

    ngOnInit() {
        this.cols = [
            { field: 'fullname', header: 'Event' },
            { field: 'subject', header: 'Status' },
            { field: 'topic', header: 'Products' },
            { field: 'textmessage', header: 'Event Lenght' },
            { field: 'date', header: 'Event Category' },
            { field: 'id', header: 'Submitted By' },
            { field: 'id', header: 'Date' },
        ];
    }
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }
    openDetails(notification: any) {
        this.fullname = notification.fullname;
        this.email = notification.email;
        this.subject = notification.subject;
        this.topic = notification.topic;
        this.textmessage = notification.textmessage;
        this.date = notification.date;
        this.notificationDialog = true;
    }
    savePromotion() {}
    hideDialog() {
        this.promotionDialog = false;
    }
}
