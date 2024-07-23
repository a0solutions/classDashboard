import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { urls } from 'src/environments/environment';
import { TokenService } from './token.service';

@Injectable({
    providedIn: 'root',
})
export class BlogService {
    url: string = urls.urlBlog;
    constructor(private http: HttpClient, private token: TokenService) {}

    getCollections() {
        return this.http.get(this.url);
    }

    postBlog(formfiles: any) {
        const params = new HttpParams().set(
            'validate',
            this.token.getValidateToken()
        );
        console.log(formfiles);
        return this.http.post(this.url, formfiles, { params });
    }
    deleteCollection(id) {
        const params = new HttpParams()
            .set('validate', this.token.getValidateToken())
            .set('collectionID', id);
        return this.http.delete(this.url, { params });
    }
}
