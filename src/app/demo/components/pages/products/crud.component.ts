import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Product } from 'src/app/demo/api/product';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ProductService } from 'src/app/demo/service/product.service';
import { urls } from 'src/environments/environment';
import { NgModel } from '@angular/forms';
import { UploadEvent } from 'primeng/fileupload';
import { TokenService } from 'src/app/demo/service/token.service';
import { take } from 'rxjs';
import { Router } from '@angular/router';

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
        private token: TokenService,
        private router: Router
    ) {}

    ngOnInit() {
        this.token.isAdmin.subscribe((x) => {
            this.isAdmin = x;
        });
        this.productService
            .getProducts()
            .pipe(take(1))
            .subscribe((data: Product[]) => {
                this.products = data;
                this.cd.markForCheck();
            });

        this.cols = [
            { field: 'name', header: 'Name' },
            { field: 'parentRef', header: 'Parent' },
            { field: 'reference', header: 'Sku' },
            { field: 'category', header: 'Category' },
            { field: 'subcategory', header: 'Subcategory' },
            { field: 'price', header: 'Price' },
            { field: 'size', header: 'Size' },
            { field: 'sets', header: 'Sets' },
            { field: 'color', header: 'Color' },
            { field: 'detailColor', header: 'Detail Color' },
            { field: 'headboardHeight', header: 'Headboard Height' },
            { field: 'frameMaterial', header: 'Frame Material' },
            { field: 'materialDetail', header: 'Material detail' },
            { field: 'upholstered', header: 'Upholstered' },
            { field: 'upholsteryMaterial', header: 'Upholstery Materail' },
            {
                field: 'upholsteryFillMaterial',
                header: 'Upholstery Fill Materail',
            },
            // { field: 'description', header: 'Description' },
            // { field: 'featureBullet', header: 'Feature Bullet' },
            { field: 'countryManufacture', header: 'Country Manufacture' },
            { field: 'shipType', header: 'Ship Type' },
            { field: 'displaySets', header: 'Display Sets' },
            { field: 'overallWidth', header: 'Overall Width' },
            { field: 'overallHeight', header: 'Overall Height' },
            { field: 'overallLenght', header: 'Overall Lenght' },
            { field: 'overallWeight', header: 'Overall Weight' },
            { field: 'levelAssembly', header: 'Level Assembly' },
            { field: 'timeAssembly', header: 'Time Assembly' },
            { field: 'comfortLevel', header: 'Comfort Level' },
            { field: 'saditionalTools', header: 'Aditional Tools' },
            { field: 'numberBoxes', header: 'Number of Boxes' },
            { field: 'installationRequired', header: 'Installation Required' },
            { field: 'commercialWarranty', header: 'Comercial Warranty' },

            { field: 'productWarranty', header: 'Product Warranty' },
            { field: 'warrantyLength', header: 'Warranty Lenght' },
            { field: 'fullOrLimitedWarranty', header: 'Full or Limited' },
            { field: 'warrantyDetails', header: 'Warranty Details' },
            { field: 'stock', header: 'Stock' },
            { field: 'delivery', header: 'Delivery' },
            { field: 'shipping', header: 'Shipping' },
            { field: 'new', header: 'New' },
            { field: 'offer', header: 'Offer' },
            { field: 'counterTopIncluded', header: 'Countertop' },
            { field: 'counterMaterial', header: 'Countertop Material' },
            { field: 'sinkIncluded', header: 'Sink' },
            { field: 'sinkType', header: 'Sink Type' },
            { field: 'date', header: 'Created' },
        ];
        this.selectedColumns = this.cols;
        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' },
        ];
    }
    imageUrl(product: Product) {
        let tempurl =
            this.url +
            'classapi/images/' +
            product.category +
            '/products/' +
            product.parentRef +
            '/' +
            product.sets +
            '/' +
            product.color +
            '/1.webp';
        return encodeURI(tempurl);
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

    confirmDeleteSelected(key: NgModel) {
        if (key.value == 'DELETE THESE PRODUCTS') {
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
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Rejected',
                detail: 'Wrong key',
            });
        }
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
                this.productService
                    .postProduct(this.product)
                    .pipe(take(1))
                    .subscribe((x) => {
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
    uploadFileShipping(event: any) {
        this.messageService.add({
            severity: 'success',
            summary: 'Saving changes...',
            detail: 'Wait until the process is complete.',
            life: 120000,
        });
        const file: File = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('MyShipping', file, file.name);
            this.productService.uploadFileShipping(formData).subscribe((x) => {
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
                    detail: 'Shipping Details Uploaded',
                    life: 3000,
                });
            });
        }
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
    NavigateProduct(product: Product) {
        window.open(
            this.url + 'product/' + product.reference + '/' + product.name,
            '_blank'
        );

        //this.router.navigate([this.url + 'product/' + product.reference]);
    }
}
