import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/demo/api/product';
import { ProductService } from 'src/app/demo/service/product.service';

interface expandedRows {
    [key: string]: boolean;
}
@Component({
    templateUrl: './emptydemo.component.html',
})
export class EmptyDemoComponent implements OnInit {
    products: Product[];
    constructor(private productService: ProductService) {}

    ngOnInit() {
        this.productService
            .getProductsWithOrdersSmall()
            .then((data) => (this.products = data));
    }
}
