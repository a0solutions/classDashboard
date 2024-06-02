import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Notification } from 'src/app/demo/api/customer';
import { NotificationsService } from 'src/app/demo/service/notifications.service';
import { urls } from 'src/environments/environment';

@Component({
    templateUrl: './notification.component.html',
    providers: [MessageService],
    styleUrls: ['./notification.component.css'],
})
export class NotificationComponent implements OnInit {
    url: string = urls.urlContact;
    notifications: Notification[] = [];
    printNotification: Notification[] = [];
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
    subjects: string[] = [];
    activeCamp: boolean[] = [];
    constructor(private notificationsService: NotificationsService) {}

    ngOnInit() {
        this.notificationsService
            .getAllNotifications()
            .subscribe((x: Notification[]) => {
                this.notifications = x;
                for (var i = 0; i < this.notifications.length; i++) {
                    if (
                        !this.subjects.find(
                            (y) => y == this.notifications[i].subject
                        ) &&
                        this.notifications[i].status == 0
                    ) {
                        this.subjects.push(this.notifications[i].subject);
                        this.activeCamp.push(false);
                    }
                }
                this.subjects.push('Answered');
                this.activeCamp.push(false);
                this.filterNotifications(this.subjects[0], 0);
            });

        this.cols = [
            { field: 'id', header: 'ID' },
            { field: 'fullname', header: 'Full Name' },
            { field: 'subject', header: 'Subject' },
            { field: 'topic', header: 'Topic' },
            { field: 'email', header: 'Email' },
            { field: 'textmessage', header: 'Text Message' },
            { field: 'date', header: 'Date' },
        ];
    }
    onGlobalFilter(table: Table, event: Event): void {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }
    filterNotifications(subject: string, index?: number): void {
        for (let i = 0; i < this.activeCamp.length; i++) {
            this.activeCamp[i] = false;
        }
        this.activeCamp[index] = true;
        if (subject != 'Answered') {
            this.printNotification = this.notifications.filter(
                (x) => x.subject == subject && x.status == 0
            );
        } else {
            this.printNotification = this.notifications.filter(
                (x) => x.status == 1
            );
        }
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
    answered(notification: Notification): void {
        this.notificationsService.answered(notification).subscribe((x) => {
            x
                ? (this.notifications.find(
                      (y) => y.id == notification.id
                  ).status = 1)
                : null;
            this.filterNotifications(
                notification.subject,
                this.subjects.indexOf(notification.subject)
            );
        });
    }
}
