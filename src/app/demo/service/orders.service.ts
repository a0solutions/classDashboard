import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TokenService } from 'src/app/demo/service/token.service';
import { urls } from 'src/environments/environment';
import { Product } from '../api/product';
import { NgModel } from '@angular/forms';
export interface cartProduct {
    product: Product;
    count: number;
}
export interface order {
    billing: billing;
    shipping: shipping;
    cartProducts: cartProduct[];
    amount: number;
    member: string;
    items: number;
    order?: string;
    atelier?: string;
    oceanic?: string;
    finale?: string;
    roadshow?: string;
    delivered?: string;
    canceled?: string;
    trackingNumber?: string;
    date?: string;
    orderId?: string;
    state?: number;
    hide?: number;
    shippingCompany?: string;
    taxes: number;
    paymentMethod: string;
}
export interface billing {
    billingName: string;
    billingSurname: string;
    billingEmail: string;
    billingPhone: string;
    billingAddress: string;
    billingAddress2: string;
    billingZip: string;
    billingCity: string;
    billingState: string;
    billingCountry: string;
}
export interface shipping {
    shippingName: string;
    shippingSurname: string;
    shippingAddress: string;
    shippingAddress2: string;
    shippingZip: string;
    shippingCity: string;
    shippingState: string;
    shippingCountry: string;
}
export interface note {
    id?: string;
    orderReference: string;
    note: string;
    user: string;
    date?: string;
}
@Injectable({
    providedIn: 'root',
})
export class OrdersService {
    url: string = urls.urlOrders;
    allNotes: note[] = [];
    placedOrders: BehaviorSubject<number> = new BehaviorSubject(0);
    constructor(private http: HttpClient, private token: TokenService) {}
    getAllOrders(): Observable<object> {
        const params = new HttpParams()
            .set('validate', this.token.getValidateToken())
            .set('context', 'admin');
        return this.http.get(this.url, { params });
    }
    placeNotes(note: note): Observable<object> {
        const params = new HttpParams()
            .set('validate', this.token.getValidateToken())
            .set('context', 'admin')
            .set('rol', 'notes');
        return this.http.post(this.url, note, { params });
    }
    getNotes(order: string): Observable<object> {
        const params = new HttpParams()
            .set('validate', this.token.getValidateToken())
            .set('context', 'admin')
            .set('rol', 'notes')
            .set('order', order);
        return this.http.get(this.url, { params });
    }
    getAllNotes(): Observable<object> {
        const params = new HttpParams()
            .set('validate', this.token.getValidateToken())
            .set('context', 'admin')
            .set('rol', 'notes')
            .set('order', 'all');
        return this.http.get(this.url, { params });
    }
    hideOrder(order: string): Observable<object> {
        const params = new HttpParams()
            .set('validate', this.token.getValidateToken())
            .set('context', 'admin')
            .set('rol', 'hideOrder')
            .set('order', order);
        return this.http.put(this.url, order, { params });
    }
    updateTracking(order: string, tracking: NgModel): Observable<object> {
        const params = new HttpParams()
            .set('validate', this.token.getValidateToken())
            .set('context', 'admin')
            .set('rol', 'updateTracking')
            .set('order', order);
        return this.http.put(
            this.url,
            { tracking: tracking.value },
            { params }
        );
    }
    updateCompany(order: string, company: NgModel): Observable<object> {
        const params = new HttpParams()
            .set('validate', this.token.getValidateToken())
            .set('context', 'admin')
            .set('rol', 'company')
            .set('order', order);
        return this.http.put(
            this.url,
            { shippingCompany: company.value },
            { params }
        );
    }
    updateStatus(order: string, company: NgModel): Observable<object> {
        const params = new HttpParams()
            .set('validate', this.token.getValidateToken())
            .set('context', 'admin')
            .set('rol', 'status')
            .set('order', order);
        return this.http.put(this.url, { status: company.value }, { params });
    }
}
