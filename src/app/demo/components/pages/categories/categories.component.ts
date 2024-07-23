import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CategoriesService } from 'src/app/demo/service/categories.service';
import { Observable } from 'rxjs';
import { NgModel } from '@angular/forms';

@Component({
    templateUrl: './categories.component.html',
    providers: [MessageService],
    styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
    categories: Observable<any>;
    tempCategory: string = '';
    tempCategorySelected: string = '';
    subcategories: any = [];
    tempSubcategory: string = '';
    constructor(
        private categoryService: CategoriesService,
        private confirmation: ConfirmationService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.getAllCategories();
    }
    deleteCategory(category: string) {
        this.categoryService.deleteCategory(category).subscribe(
            (x) => {
                this.getAllCategories();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Confirmed',
                    detail: 'Category Deleted',
                });
            },

            (error) => {
                console.log(error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Rejected',
                    detail: 'There was an error, try again later',
                });
            }
        );
    }
    getAllCategories() {
        this.categories = this.categoryService.getCategories();
    }
    updateCategory(category: string, model: NgModel) {
        this.tempCategory = category;
    }
    postNewCategory(category: NgModel) {
        this.categoryService.postCategory(category.value).subscribe(
            (x) => {
                category.reset();
                this.getAllCategories();

                this.messageService.add({
                    severity: 'success',
                    summary: 'Confirmed',
                    detail: 'The new category was created',
                });
            },
            (error) => {
                console.log(error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Rejected',
                    detail: 'There was an error, try again later',
                });
            }
        );
    }
    sendPutCategory(category: NgModel) {
        this.categoryService
            .putCategory(category.value, this.tempCategory)
            .subscribe(
                (x) => {
                    this.tempCategory = '';
                    category.reset();
                    this.getAllCategories();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Confirmed',
                        detail: 'The category was updated',
                    });
                },
                (error) => {
                    console.log(error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Rejected',
                        detail: 'There was an error, try again later',
                    });
                }
            );
    }
    selectSubcategories(categorySelected: NgModel) {
        this.tempCategorySelected = categorySelected.value;
        this.categories.forEach((x) => {
            x.filter((y) => {
                if (y.id === categorySelected.value) {
                    this.subcategories = y.subcategories;
                }
            });
        });
    }

    updateSubcategoryElement(subcategory: string): void {
        this.tempSubcategory = subcategory;
    }
    sendPutSubcategory(subCategoryInput: NgModel, categorySelected: NgModel) {
        this.categoryService
            .updateSubactegory(subCategoryInput.value, this.tempSubcategory)
            .subscribe((x) => {
                subCategoryInput.reset();
                this.tempSubcategory = '';
                this.getAllCategories();
                this.selectSubcategories(categorySelected);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Confirmed',
                    detail: 'The product type was updated',
                });
            });
    }
    deleteSubcategory(subcategory: string, categorySelected: NgModel) {
        this.categoryService.deleteSubcategory(subcategory).subscribe((x) => {
            this.getAllCategories();
            this.selectSubcategories(categorySelected);
            this.messageService.add({
                severity: 'success',
                summary: 'Confirmed',
                detail: 'The product type was deleted',
            });
        });
    }
    postNewSucategory(subcategory: NgModel, categorySelected: NgModel) {
        this.categoryService
            .postSubcategory(subcategory.value, this.tempCategorySelected)
            .subscribe(
                (x) => {
                    this.getAllCategories();
                    this.selectSubcategories(categorySelected);
                    subcategory.reset();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Confirmed',
                        detail: 'The new product type was created',
                    });
                },
                (error) => {
                    console.log(error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Rejected',
                        detail: 'There was an error, try again later',
                    });
                }
            );
    }
}
