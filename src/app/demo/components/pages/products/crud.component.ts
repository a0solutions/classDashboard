import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Product } from 'src/app/demo/api/product';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ProductService } from 'src/app/demo/service/product.service';
import { urls } from 'src/environments/environment';
import { NgModel } from '@angular/forms';
import { UploadEvent } from 'primeng/fileupload';
import { TokenService } from 'src/app/demo/service/token.service';

@Component({
    templateUrl: './crud.component.html',
    providers: [MessageService],
    styleUrls: ['./crud.component.css'],
})
export class CrudComponent implements OnInit {
    url: string = urls.url;
    productDialog: boolean = false;

    deleteProductDialog: boolean = false;

    deleteProductsDialog: boolean = false;

    products: Product[] = [];

    product: Product = <Product>{};

    selectedProducts: Product[] = [];

    submitted: boolean = false;
    uploadUrl = urls.urlProducts;
    cols: any[] = [];
    selectedColumns: any[] = [];
    statuses: any[] = [];
    uploadedFiles: any[] = [];
    isAdmin: boolean = false;
    rowsPerPageOptions = [5, 10, 20];

    constructor(
        private productService: ProductService,
        private messageService: MessageService,
        private cd: ChangeDetectorRef,
        private token: TokenService
    ) {}

    ngOnInit() {
        this.token.isAdmin.subscribe((x) => {
            this.isAdmin = x;
        });
        this.productService
            .getProducts()
            .toPromise()
            .then((data) => {
                this.products = data;
                this.cd.markForCheck();
            });

        this.cols = [
            { field: 'name', header: 'Name' },
            { field: 'parentRef', header: 'Parent' },
            { field: 'reference', header: 'Sku' },
            { field: 'price', header: 'Price' },
            { field: 'stock', header: 'Stock' },
            { field: 'category', header: 'Category' },
            { field: 'subcategory', header: 'Subcategory' },
            { field: 'color', header: 'Color' },
            { field: 'detailColor', header: 'Detail Color' },
            { field: 'date', header: 'Created' },
            { field: 'size', header: 'Size' },
            { field: 'sets', header: 'Sets' },
        ];
        this.selectedColumns = this.cols;
        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' },
        ];
    }

    openNew() {
        this.product = <Product>{};
        this.submitted = false;
        this.productDialog = true;
    }

    deleteSelectedProducts() {
        this.deleteProductsDialog = true;
    }

    editProduct(product: Product) {
        this.product = { ...product };
        this.productDialog = true;
    }

    deleteProduct(product: Product) {
        this.deleteProductDialog = true;
        this.product = { ...product };
    }

    confirmDeleteSelected() {
        this.deleteProductsDialog = false;
        this.products = this.products.filter(
            (val) => !this.selectedProducts.includes(val)
        );
        let ids = this.gettingIds(this.selectedProducts);
        this.productService.deleteProducts(ids).subscribe((x) => {
            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Products Deleted',
                life: 3000,
            });
            this.selectedProducts = [];
        });
    }
    gettingIds(products: Product[]): string[] {
        let ids: string[] = [];
        products.forEach((x) => {
            ids.push(x.id);
        });
        return ids;
    }
    confirmDelete() {
        this.deleteProductDialog = false;
        this.products = this.products.filter(
            (val) => val.id !== this.product.id
        );
        this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Product Deleted',
            life: 3000,
        });
        this.product = <Product>{};
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    saveProduct() {
        this.submitted = true;
        if (this.product.name?.trim()) {
            if (this.product.reference) {
                // @ts-ignore
                this.products[this.findIndexById(this.product.reference)] =
                    this.product;
                this.productService.postProduct(this.product).subscribe((x) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Product Updated',
                        life: 3000,
                    });
                });
            } else {
                this.product.parentRef = 'product-placeholder.svg';
                // @ts-ignore
                this.product.inventoryStatus = this.product.inventoryStatus
                    ? this.product.stock
                    : 'INSTOCK';
                this.products.push(this.product);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Created',
                    life: 3000,
                });
            }

            this.products = [...this.products];
            this.productDialog = false;
            this.product = <Product>{};
        }
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].reference === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }
    uploadFile(event: any) {
        const file: File = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('MyProducts', file, file.name);
            this.productService.uploadFile(formData).subscribe((x) => {
                console.log(x);
                this.productService
                    .getProducts()
                    .toPromise()
                    .then((data) => {
                        this.products = data;
                        this.cd.markForCheck();
                    });
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Products Uploaded',
                    life: 3000,
                });
            });
        }
    }
}
