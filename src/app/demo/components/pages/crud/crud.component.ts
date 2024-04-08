import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Product } from 'src/app/demo/api/product';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ProductService } from 'src/app/demo/service/product.service';

@Component({
    templateUrl: './crud.component.html',
    providers: [MessageService],
})
export class CrudComponent implements OnInit {
    productDialog: boolean = false;

    deleteProductDialog: boolean = false;

    deleteProductsDialog: boolean = false;

    products: Product[] = [];

    product: Product = <Product>{};

    selectedProducts: Product[] = [];

    submitted: boolean = false;

    cols: any[] = [];
    selectedColumns: any[] = [];
    statuses: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    constructor(
        private productService: ProductService,
        private messageService: MessageService,
        private cd: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.productService
            .getProducts()
            .toPromise()
            .then((data) => {
                this.products = data;
                this.cd.markForCheck();
            });

        this.cols = [
            { field: 'name', header: 'Name' },
            { field: 'parentRef', header: 'DOR' },
            { field: 'reference', header: 'Sku' },
            { field: 'category', header: 'Category' },
            { field: 'subcategory', header: 'Subcategory' },
            { field: 'color', header: 'Color' },
            { field: 'detailColor', header: 'Detail Color' },
            { field: 'frameMaterial', header: 'Frame Material' },
            { field: 'materialDetail', header: 'Material Detail' },
            { field: 'upholstered', header: 'Upholstered' },
            { field: 'price', header: 'Price' },
            { field: 'oldprice', header: 'Offer Price' },
            { field: 'minimunOrder', header: 'Minimun Order' },
            { field: 'size', header: 'Size' },
            { field: 'sets', header: 'Sets' },
            { field: 'countryManufacture', header: 'Manufacture' },
            { field: 'shipType', header: 'Ship Type' },
            { field: 'displaySets', header: 'Display Sets' },
            { field: 'overallWidth', header: 'Overall Width' },
            { field: 'overallHeight', header: 'Overall Height' },
            { field: 'overallLenght', header: 'Overall Lenght' },
            { field: 'overallWeight', header: 'Overall Weight' },
            { field: 'levelAssembly', header: 'Level Assembly' },
            { field: 'timeAssembly', header: 'Time Assembly' },
            { field: 'comfortLevel', header: 'Comfort Level' },
            { field: 'aditionalTools', header: 'Aditional Tools' },
            { field: 'numberBoxes', header: 'Number of boxes' },
            { field: 'installationRequired', header: 'Installation' },
            { field: 'commercialWarranty', header: 'Commercial Warranty' },
            { field: 'productWarranty', header: 'Product Warranty' },
            { field: 'warrantyLength', header: 'Warranty Lenght' },
            {
                field: 'fullOrLimitedWarranty',
                header: 'FullorLimited',
            },
            { field: 'warrantyDetails', header: 'Warranty Details' },
            { field: 'headboardHeight', header: ' Head Board Height' },
            { field: 'stock', header: 'Stock' },
            { field: 'new', header: 'Is New' },
            { field: 'offer', header: 'Is Offer' },
            { field: 'membersOnly', header: 'Members Only' },
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
        this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Products Deleted',
            life: 3000,
        });
        this.selectedProducts = [];
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
            if (this.product.id) {
                // @ts-ignore
                this.product.inventoryStatus = this.product.inventoryStatus
                    .value
                    ? this.product.stock
                    : this.product.stock;
                this.products[this.findIndexById(this.product.id)] =
                    this.product;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Updated',
                    life: 3000,
                });
            } else {
                this.product.id = this.createId();
                this.product.reference = this.createId();
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
            if (this.products[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        const chars =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }
}
