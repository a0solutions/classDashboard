import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { urls } from 'src/environments/environment';
import { TokenService } from './token.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CategoriesService {
    url: string = urls.urlctagories;
    constructor(private http: HttpClient, private token: TokenService) {}

    getCategories(): Observable<any> {
        return this.http.get(this.url);
    }
    deleteCategory(category: string) {
        const params = new HttpParams()
            .set('validate', this.token.getValidateToken())
            .set('category', category);
        return this.http.delete(this.url, { params });
    }
    postCategory(category: string) {
        const params = new HttpParams().set(
            'validate',
            this.token.getValidateToken()
        );
        return this.http.post(this.url, JSON.stringify(category), { params });
    }
    putCategory(category: string, oldCategory: string) {
        const params = new HttpParams().set(
            'validate',
            this.token.getValidateToken()
        );
        return this.http.put(
            this.url,
            { category: category, oldCategory: oldCategory },
            { params }
        );
    }
    postSubcategory(subcategory, category) {
        const params = new HttpParams()
            .set('validate', this.token.getValidateToken())
            .set('subcategory', true);
        return this.http.post(
            this.url,
            { subcategory: subcategory, category: category },
            { params }
        );
    }
    deleteSubcategory(subcategory: string) {
        const params = new HttpParams()
            .set('validate', this.token.getValidateToken())
            .set('subcategory', subcategory);
        return this.http.delete(this.url, { params });
    }
    updateSubactegory(subcategory: string, oldSubcategory: string) {
        const params = new HttpParams()
            .set('validate', this.token.getValidateToken())
            .set('subcategory', true);
        return this.http.put(
            this.url,
            { subcategory: subcategory, oldsubcategory: oldSubcategory },
            { params }
        );
    }
}
