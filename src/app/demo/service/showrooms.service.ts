import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { urls } from 'src/environments/environment';
import { take } from 'rxjs';
import { TokenService } from './token.service';
export interface popup {
    top: number;
    left: number;
    reference: string;
}
export interface showrooms {
    id: string;
    name: string;
    category: string;
    popups: string;
    img: string;
    date: string;
}
@Injectable()
export class ShowroomsService {
    url = urls.urlShowrooms;
    constructor(private http: HttpClient, private tokenManage: TokenService) {}

    getShowrooms() {
        const params = new HttpParams().set('category', 'all');
        return this.http.get<any>(this.url, { params }).pipe(take(1));
    }
    setShowroom(showroom: showrooms) {
        let token = this.tokenManage.getValidateToken();
        const params = new HttpParams().set('validate', token);
        return this.http.put<any>(this.url, showroom, { params }).pipe(take(1));
    }
    postShowroom(file: any, name: string, category: string) {
        let token = this.tokenManage.getValidateToken();
        const params = new HttpParams()
            .set('validate', token)
            .set('name', name)
            .set('category', category);
        return this.http.post<any>(this.url, file, { params }).pipe(take(1));
    }
    deleteShowroom(showroom: showrooms) {
        let token = this.tokenManage.getValidateToken();
        const params = new HttpParams()
            .set('validate', token)
            .set('id', showroom.id)
            .set('img', showroom.img);
        return this.http.delete(this.url, { params }).pipe(take(1));
    }
}
