import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Product } from 'src/app/demo/api/product';
import { urls } from 'src/environments/environment';

@Component({
    selector: 'app-crud-form',
    templateUrl: './crud-form.component.html',
    styleUrls: ['./crud-form.component.css'],
})
export class CrudFormComponent implements OnInit {
    @Input() product: Product = <Product>{};
    submitted: boolean = false;
    constructor(private http: HttpClient) {}
    url: string = urls.urlctagories;
    allCategories: string[] = [];
    subcategories: string[] = [];
    catAndSub: any = '';
    YesNo: any[] = [];
    featureBullets: string[] = [];
    ngOnInit() {
        this.catAndSub == '' ? this.getElementsCategories() : null;
        this.YesNo = [
            { name: 'Yes', value: 'Yes' },
            { name: 'No', value: 'No' },
            { name: 'N/A', value: '' },
        ];
        this.featureBullets = JSON.parse(<string>this.product.featureBullet);
    }
    getElementsCategories() {
        this.http.get(this.url).subscribe((x: any) => {
            this.catAndSub = x;
            this.changeCategorie(this.product.category);
        });
    }
    changeCategorie(category: string) {
        this.subcategories = [];
        this.allCategories = [];
        this.catAndSub.forEach((y) => {
            this.allCategories.push(y.category);
            if (y.category == category) {
                this.subcategories = y.subcategories;
            }
        });
    }
    addBullet(valor: NgModel) {
        this.featureBullets.push(valor.value);
        valor.reset();
        this.product.featureBullet = JSON.stringify(this.featureBullets);
    }
    deleteBullet(bullet: string) {
        let index = this.featureBullets.indexOf(bullet);
        this.featureBullets.splice(index, 1);
        this.product.featureBullet = JSON.stringify(this.featureBullets);
    }
}
