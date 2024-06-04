import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../api/product';
import { urls } from 'src/environments/environment';
import { TokenService } from './token.service';
import { Observable } from 'rxjs';
import { Promotion } from '../api/customer';

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
        const params = new HttpParams()
            .set('context', 'admin')
            .set('validate', actualToken)
            .set('ids', ids);
        return this.http.delete(this.url, { params });
    }
    postProduct(product: Product) {
        let actualToken = this.token.getValidateToken();
        const params = new HttpParams()
            .set('context', 'admin')
            .set('validate', actualToken);
        return this.http.put(this.url, product, { params });
    }
    uploadFile(file: any) {
        let actualToken = this.token.getValidateToken();
        const params = new HttpParams()
            .set('context', 'admin')
            .set('validate', actualToken);
        return this.http.post(this.url, file, { params });
    }
    postPromo(promo: Promotion): Observable<object> {
        let actualToken = this.token.getValidateToken();
        const params = new HttpParams()
            .set('context', 'admin')
            .set('validate', actualToken)
            .set('promo', true);
        return this.http.post(this.url, promo, { params });
    }
    getPromo(): Observable<object> {
        let actualToken = this.token.getValidateToken();
        const params = new HttpParams()
            .set('context', 'admin')
            .set('validate', actualToken)
            .set('promo', true);
        return this.http.get(this.url, { params });
    }
    putPromo(promo: Promotion): Observable<object> {
        let actualToken = this.token.getValidateToken();
        const params = new HttpParams()
            .set('context', 'admin')
            .set('validate', actualToken)
            .set('promo', true);
        return this.http.put(this.url, promo, { params });
    }
    deleteProductFromPromo(
        product: Product,
        promo: Promotion
    ): Observable<object> {
        let actualToken = this.token.getValidateToken();
        const params = new HttpParams()
            .set('context', 'admin')
            .set('validate', actualToken)
            .set('promo', product.reference)
            .set('product', JSON.stringify(promo));
        return this.http.delete(this.url, { params });
    }
    deletePromotion(promotion: Promotion) {
        let actualToken = this.token.getValidateToken();
        const params = new HttpParams()
            .set('context', 'admin')
            .set('validate', actualToken)
            .set('promo', true)
            .set('promotion', JSON.stringify(promotion));
        return this.http.delete(this.url, { params });
    }
    activePromotion(object: object) {
        let actualToken = this.token.getValidateToken();
        const params = new HttpParams()
            .set('context', 'admin')
            .set('validate', actualToken)
            .set('activePromotion', true);
        return this.http.put(this.url, object, { params });
    }
}
