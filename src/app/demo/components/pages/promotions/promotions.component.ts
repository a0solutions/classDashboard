import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Promotion } from 'src/app/demo/api/customer';
import { ProductService } from 'src/app/demo/service/product.service';
import { TokenService } from 'src/app/demo/service/token.service';
import { urls } from 'src/environments/environment';
import { take } from 'rxjs/operators';

@Component({
    templateUrl: './promotions.component.html',
    providers: [MessageService],
    styleUrls: ['./promotions.component.css'],
})
export class PromotionsComponent implements OnInit {
    url: string = urls.urlContact;
    promotions: Promotion[] = [];
    selectedColumns: any[] = [];
    selectedPromotions: Promotion[] = [];
    cols: any[] = [];
    notificationDialog: boolean = false;
    promo: Promotion = <Promotion>{};
    //*********************** Notifications Properties */
    fullname: string = '';
    subject: string = '';
    topic: string = '';
    email: string = '';
    textmessage: string = '';
    date: string = '';
    promotionDialog: boolean = false;
    promotionSelected: Promotion = <Promotion>{};
    deleteHideDialog: boolean = false;
    temp: any;
    tempSelectedPromo: Promotion;
    flag: string = '';
    isAdmin: boolean = false;
    constructor(
        private messageService: MessageService,
        private productService: ProductService,
        private token: TokenService
    ) {}

    ngOnInit() {
        this.cols = [
            { field: 'event', header: 'Event' },
            { field: 'status', header: 'Status' },
            { field: 'products', header: 'Products' },
            { field: 'eventLenght', header: 'Event Lenght' },
            { field: 'eventCategory', header: 'Event Category' },
            { field: 'submmitedBy', header: 'Submitted By' },
            { field: 'date', header: 'Date' },
        ];
        this.token.isAdmin.subscribe((x) => {
            this.isAdmin = x;
        });
        this.getAllPromotions();
    }
    getAllPromotions() {
        this.productService
            .getPromo()
            .pipe(take(1))
            .subscribe((x: Promotion[]) => {
                this.promotions = x;
            });
    }
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }
    savePromotion() {
        this.tempSelectedPromo = this.promo;
        if (this.promo.event?.trim()) {
            if (this.promo.id == undefined) {
                this.productService
                    .postPromo(this.promo)
                    .pipe(take(1))
                    .subscribe((x) => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Product Updated',
                            life: 3000,
                        });
                        this.getAllPromotions();
                    });

                this.promotionDialog = false;
                this.promotions.push(this.promo);
                this.tempSelectedPromo = <Promotion>{};
            } else {
                this.productService
                    .putPromo(this.promo)
                    .pipe(take(1))
                    .subscribe((x) => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Product Updated',
                            life: 3000,
                        });
                        this.getAllPromotions();
                    });
                this.promotionDialog = false;
            }
        }
    }
    hideDialog() {
        this.promotionDialog = false;
        this.deleteHideDialog = false;
        this.getAllPromotions();
    }
    getProductsNumber(promo: Promotion): string {
        return promo.products.length.toString();
    }
    openModal(promo?: Promotion) {
        if (promo != undefined) {
            this.promo = promo;
        } else {
            this.promo = <Promotion>{};
            this.promo.products = [];
        }
        this.promotionDialog = true;
    }
    confirm() {
        if (this.flag == 'deletePromotion') {
            this.productService.deletePromotion(this.temp).subscribe((x) => {
                this.promotions.splice(this.promotions.indexOf(this.temp), 1);
                this.hideDialog();
            });
        } else if (this.flag == 'activePromotion') {
            this.productService.activePromotion(this.temp).subscribe((x) => {
                this.hideDialog();
            });
        }
    }

    deletePromotion(promotion: Promotion) {
        this.flag = 'deletePromotion';
        this.temp = promotion;
        this.deleteHideDialog = true;
    }
    activePromotion(promotion: Promotion) {
        this.flag = 'activePromotion';
        this.temp = { newstatus: 1, id: promotion.id };
        this.deleteHideDialog = true;
    }
    unsetPromotion(promotion: Promotion) {
        this.flag = 'activePromotion';
        this.temp = { newstatus: 0, id: promotion.id };
        this.deleteHideDialog = true;
    }
}
