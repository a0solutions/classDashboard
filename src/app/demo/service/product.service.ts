import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../api/product';
import { urls } from 'src/environments/environment';
import { TokenService } from './token.service';

@Injectable()
export class ProductService {
    url: string = urls.urlProducts;
    constructor(private http: HttpClient, private token: TokenService) {}

    getProductsSmall() {
        return this.http
            .get<any>('assets/demo/data/products-small.json')
            .toPromise()
            .then((res) => res.data as Product[])
            .then((data) => data);
    }

    getProducts() {
        return this.http.get<any>(this.url);
    }

    getProductsMixed() {
        return this.http
            .get<any>('assets/demo/data/products-mixed.json')
            .toPromise()
            .then((res) => res.data as Product[])
            .then((data) => data);
    }

    getProductsWithOrdersSmall() {
        return this.http
            .get<any>('assets/demo/data/products-orders-small.json')
            .toPromise()
            .then((res) => res.data as Product[])
            .then((data) => data);
    }
    deleteProducts(ids: any) {
        let actualToken = this.token.getValidateToken();
        return this.http.delete(
            this.url + '?context=admin&validate=' + actualToken + '&ids=' + ids
        );
    }
    postProduct(product: Product) {
        let actualToken = this.token.getValidateToken();
        return this.http.put(
            this.url + '?context=admin&validate=' + actualToken,
            product
        );
    }
    uploadFile(file: any) {
        let actualToken = this.token.getValidateToken();
        return this.http.post(
            this.url + '?context=admin&validate=' + actualToken,
            file
        );
    }
}
