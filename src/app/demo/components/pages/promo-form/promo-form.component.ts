import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Promotion } from 'src/app/demo/api/customer';
import { Product } from 'src/app/demo/api/product';
import { urls } from 'src/environments/environment';

@Component({
    selector: 'app-promo-form',
    templateUrl: './promo-form.component.html',
    styleUrls: ['./promo-form.component.css'],
})
export class PromoFormComponent implements OnInit {
    @Input() promo: Promotion = <Promotion>{};
    submitted: boolean = false;
    constructor(private http: HttpClient) {}
    url: string = urls.urlctagories;
    allCategories: string[] = [];
    subcategories: string[] = [];
    catAndSub: any = '';
    categories: any[] = [];
    featureBullets: string[] = [];

    ngOnInit() {
        this.catAndSub == '' ? this.getElementsCategories() : null;
        this.categories = [
            { name: 'Single Day Sales', value: 'Single Day Sales' },
            { name: 'Shopping Holiday', value: 'Shopping Holiday' },
            { name: 'Category Sales', value: 'Category Sales' },
        ];
    }
    getElementsCategories() {}
    changeCategorie(category: string) {}
}
