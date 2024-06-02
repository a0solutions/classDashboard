import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Promotion } from 'src/app/demo/api/customer';
import { Product } from 'src/app/demo/api/product';
import { ProductService } from 'src/app/demo/service/product.service';
import { TokenService } from 'src/app/demo/service/token.service';
import { urls } from 'src/environments/environment';

@Component({
    selector: 'app-promo-form',
    templateUrl: './promo-form.component.html',
    styleUrls: ['./promo-form.component.css'],
})
export class PromoFormComponent implements OnInit {
    @Input() promo: Promotion = <Promotion>{};
    submitted: boolean = false;
    products: Product[];
    selectedProductsPlaced: Product[];
    selectedProducts: Product[];
    promotionProducts: Product[];
    url: string = urls.urlctagories;
    allCategories: string[] = [];
    subcategories: string[] = [];
    categories: any[] = [];
    featureBullets: string[] = [];
    searchValue: string | undefined;
    openProducts: boolean = false;
    constructor(
        private productsServices: ProductService,
        private token: TokenService,
        private confirmation: ConfirmationService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.categories = [
            { name: 'Single Day Sales', value: 'Single Day Sales' },
            { name: 'Shopping Holiday', value: 'Shopping Holiday' },
            { name: 'Category Sales', value: 'Category Sales' },
        ];
        this.getAllProducts();
        this.promo.submmitedBy = this.token.getUserName();
        this.promo.status = 0;
    }
    getAllProducts() {
        this.productsServices.getProducts().subscribe((x: Product[]) => {
            this.products = x;
            this.placeProductsSelected();
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }
    placeProductsSelected(): void {
        this.promotionProducts = [];
        this.promo.products.forEach((x) => {
            let tempProduct = this.products.find(
                (y) => y.reference == x.reference
            );
            this.promotionProducts.push(tempProduct);
            x.oldprice = tempProduct.promoPrice;
        });
    }
    hideDialog(): void {
        this.openProducts = false;
    }
    savePromotion(): void {
        for (var i = 0; i < this.selectedProducts.length; i++) {
            this.promo.products.push({
                reference: this.selectedProducts[i].reference,
                oldprice: this.selectedProducts[i].promoPrice,
            });
        }
        this.selectedProducts = [];
        this.placeProductsSelected();
        this.openProducts = false;
    }
    openProductsMethod(): void {
        this.selectedProducts = [];
        this.openProducts = true;
    }
    existProducts(product: Product): boolean {
        if (this.promo.products.find((x) => x.reference == product.reference))
            return true;
        return false;
    }
    deleteProductPromotion(product: Product) {
        this.confirm(product);
    }
    confirm(product: Product) {
        this.confirmation.confirm({
            key: 'confirm',
            target: event.target || new EventTarget(),
            message: 'Are you sure that you want to proceed?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                let tempProduct = this.promo.products.find(
                    (x) => x.reference == product.reference
                );
                this.promo.products.splice(
                    this.promo.products.indexOf(tempProduct),
                    1
                );
                this.promotionProducts.splice(
                    this.promotionProducts.indexOf(
                        this.promotionProducts.find(
                            (x) => x.reference == tempProduct.reference
                        )
                    ),
                    1
                );
                this.productsServices
                    .deleteProductFromPromo(product, this.promo)
                    .subscribe((x) => {
                        this.products.find(
                            (x) => x.reference == product.reference
                        ).promoPrice = 0;
                        this.products.find(
                            (x) => x.reference == product.reference
                        ).offer = 0;
                    });
                this.messageService.add({
                    severity: 'info',
                    summary: 'Confirmed',
                    detail: 'You have accepted',
                });
            },
            reject: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Rejected',
                    detail: 'You have rejected',
                });
            },
        });
    }
}
