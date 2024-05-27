import { Component, OnInit } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { LoginService } from 'src/app/demo/service/login.service';
import {
    OrdersService,
    note,
    order,
} from 'src/app/demo/service/orders.service';
import { TokenService } from 'src/app/demo/service/token.service';

interface expandedRows {
    [key: string]: boolean;
}

@Component({
    templateUrl: './emptydemo.component.html',
    styleUrls: ['./style.css'],
})
export class EmptyDemoComponent implements OnInit {
    ordersList: order[] = [];
    hideList: order[] = [];
    hiddenOrderList: order[] = [];
    deleteNoteDialog: boolean = false;
    deleteHideDialog: boolean = false;
    deleteInformationDialog: boolean = false;
    allNotes: note[] = [];
    actualId: string = '';
    statusBBDD: string[] = [];
    statusClass: string[] = [];
    informationOrder: order;
    isAdmin: boolean = false;
    companiesShipping: string[] = ['DHL', 'USPS', 'UPS', 'FedEx'];
    toogleCompany: boolean = true;
    constructor(
        private orders: OrdersService,
        private user: LoginService,
        private confirmation: ConfirmationService,
        private messageService: MessageService,
        private token: TokenService
    ) {}

    ngOnInit() {
        this.getAll();
        this.token.isAdmin.subscribe((x) => {
            this.isAdmin = x;
        });
    }
    getAll(): void {
        this.orders.getAllNotes().subscribe({
            next: this.gettingAll.bind(this),
            error: this.errorManage.bind(this),
        });
    }
    errorManage(x: any) {
        this.user.signOut();
    }
    gettingAll(x: object): void {
        this.orders.allNotes = <note[]>x;
        this.orders.getAllOrders().subscribe({
            next: this.placeOrders.bind(this),
            error: console.log.bind(this),
        });
    }
    placeOrders(data: order[]): void {
        this.ordersList = [];
        this.hideList = [];
        this.ordersList = <order[]>data.filter((x) => x.hide != 1);
        this.hideList = <order[]>data.filter((x) => x.hide == 1);
        console.log(this.hideList);
    }
    placeStatusClass(order: order): string {
        if (order.canceled) return 'canceled';
        if (order.delivered) return 'delivered';
        if (order.roadshow) return 'roadshow';
        if (order.finale) return 'finale';
        if (order.oceanic) return 'oceanic';
        if (order.atelier) return 'atelier';
        return 'placed';
    }

    addNote(note: NgForm): void {
        let newNote: note = <note>{};
        newNote.note = note.value.newNote;
        newNote.orderReference = this.actualId;
        newNote.user = this.user.getUserName();
        this.orders.placeNotes(newNote).subscribe((x) => {
            note.reset();
            this.orders.allNotes.push(newNote);
            this.getNotes(this.actualId);
        });
    }
    getNotes(order: string): void {
        this.actualId = order;
        this.orders.getNotes(order).subscribe((x) => {
            this.allNotes = <note[]>x;
            this.deleteNoteDialog = true;
        });
    }
    numberOfNotes(order: string) {
        let x: number = 0;
        return this.orders.allNotes
            .filter((x) => x.orderReference == order)
            .length.toString();
    }
    hideOrder(order: string): void {
        this.actualId = order;
        this.deleteHideDialog = true;
    }
    confirmhideSelected(): void {
        this.orders.hideOrder(this.actualId).subscribe((x: any) => {
            let tempOrders = this.ordersList.concat(this.hideList);
            tempOrders.filter((x) => {
                if (x.order == this.actualId) {
                    x.hide == 1 ? (x.hide = 0) : (x.hide = 1);
                }
            });
            this.getAll();
            this.deleteHideDialog = false;
        });
    }
    updateTracking(order: string, value: any, event: Event): void {
        this.confirm2(event, 'tracking', order, value);
    }
    updateComany(order: string, value: any, event: Event) {
        this.confirm2(event, 'company', order, value);
    }
    updateStatus(order: string, value: any, event: Event) {
        this.confirm2(event, 'status', order, value);
    }

    confirm2(event: Event, flag?: string, order?: string, value?: any) {
        this.confirmation.confirm({
            key: 'confirm2',
            target: event.target || new EventTarget(),
            message: 'Are you sure that you want to proceed?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.placeChange(order, flag, value);
                this.messageService.add({
                    severity: 'info',
                    summary: 'Confirmed',
                    detail: 'You have accepted',
                });
                this.getAll();
            },
            reject: () => {
                this.getAll();
                this.messageService.add({
                    severity: 'error',
                    summary: 'Rejected',
                    detail: 'You have rejected',
                });
            },
        });
    }
    placeChange(order: string, flag: string, value: NgModel): void {
        if (flag == 'tracking') {
            this.orders.updateTracking(order, value).subscribe((x) => {
                this.ordersList.find((x) => x.order == order).trackingNumber =
                    value.value;
            });
        } else if (flag == 'company') {
            this.orders.updateCompany(order, value).subscribe((x) => {
                this.ordersList.find((x) => x.order == order).shippingCompany =
                    value.value;
            });
        } else if (flag == 'status') {
            this.orders.updateStatus(order, value).subscribe((x) => {});
        }
    }
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }
    getInformation(order: order) {
        this.informationOrder = order;
        this.deleteInformationDialog = true;
    }
}
