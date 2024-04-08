import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/demo/api/product';

@Component({
    selector: 'app-crud-form',
    templateUrl: './crud-form.component.html',
    styleUrls: ['./crud-form.component.css'],
})
export class CrudFormComponent implements OnInit {
    @Input() product: Product = <Product>{};
    submitted: boolean = false;
    constructor() {}

    ngOnInit() {}
}
