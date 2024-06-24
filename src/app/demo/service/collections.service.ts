import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { urls } from 'src/environments/environment';
import { TokenService } from './token.service';

@Injectable({
    providedIn: 'root',
})
export class CollectionsService {
    url: string = urls.urlCollections;
    constructor(private http: HttpClient, private token: TokenService) {}

    getCollections() {
        return this.http.get(this.url);
    }

    postCollection(name: string, description: string, formfiles: any) {
        const params = new HttpParams()
            .set('validate', this.token.getValidateToken())
            .set('name', name)
            .set('description', description);

        return this.http.post(this.url, formfiles, { params });
    }
    deleteCollection(id) {
        const params = new HttpParams()
            .set('validate', this.token.getValidateToken())
            .set('collectionID', id);
        return this.http.delete(this.url, { params });
    }
}
