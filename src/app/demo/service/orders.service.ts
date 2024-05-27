import { HttpClient } from '@angular/common/http';
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
        let actualToken = this.token.getValidateToken();
        return this.http.get(
            this.url + '?validate=' + actualToken + '&context=admin'
        );
    }
    placeNotes(note: note): Observable<object> {
        let actualToken = this.token.getValidateToken();
        return this.http.post(
            this.url + '?context=admin&validate=' + actualToken + '&rol=notes',
            note
        );
    }
    getNotes(order: string): Observable<object> {
        let actualToken = this.token.getValidateToken();
        return this.http.get(
            this.url +
                '?validate=' +
                actualToken +
                '&context=admin&rol=notes&order=' +
                order
        );
    }
    getAllNotes(): Observable<object> {
        let actualToken = this.token.getValidateToken();
        return this.http.get(
            this.url +
                '?validate=' +
                actualToken +
                '&context=admin&rol=notes&order=all'
        );
    }
    hideOrder(order: string): Observable<object> {
        let actualToken = this.token.getValidateToken();
        return this.http.put(
            this.url +
                '?validate=' +
                actualToken +
                '&context=admin&rol=hideOrder&order=' +
                order,
            order
        );
    }
    updateTracking(order: string, tracking: NgModel): Observable<object> {
        let actualToken = this.token.getValidateToken();
        return this.http.put(
            this.url +
                '?validate=' +
                actualToken +
                '&context=admin&rol=updateTracking&order=' +
                order,
            { tracking: tracking.value }
        );
    }
    updateCompany(order: string, company: NgModel): Observable<object> {
        let actualToken = this.token.getValidateToken();
        return this.http.put(
            this.url +
                '?validate=' +
                actualToken +
                '&context=admin&rol=company&order=' +
                order,
            { shippingCompany: company.value }
        );
    }
    updateStatus(order: string, company: NgModel): Observable<object> {
        let actualToken = this.token.getValidateToken();
        return this.http.put(
            this.url +
                '?validate=' +
                actualToken +
                '&context=admin&rol=status&order=' +
                order,
            { status: company.value }
        );
    }
}
