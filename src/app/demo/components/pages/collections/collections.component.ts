import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { CollectionsService } from 'src/app/demo/service/collections.service';
import { urls } from 'src/environments/environment';

@Component({
    templateUrl: './collections.component.html',
    styleUrls: ['./collections.component.css'],
})
export class CollectionsComponent implements OnInit {
    formLogo: any;
    formDocument: any;
    formBanner: any;
    name: string;
    description: string;
    formfiles = new FormData();
    collections: Observable<any>;
    url: string = urls.url;
    saveButton = 'Save';
    constructor(
        private CollectionService: CollectionsService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.getAllCollections();
    }
    getAllCollections() {
        this.collections = this.CollectionService.getCollections();
    }
    uploadDocument(event: any) {
        if (event.target.files[0]) {
            const fileList: FileList = event.target.files;
            for (var i = 0; i <= fileList.length; i++) {
                this.formfiles.append('Myfiles[3]', event.target.files[i]);
            }
        }
    }
    uploadBanner(event: any) {
        if (event.target.files[0]) {
            const fileList: FileList = event.target.files;
            for (var i = 0; i <= fileList.length; i++) {
                this.formfiles.append('Myfiles[1]', event.target.files[i]);
            }
        }
    }
    uploadLogo(event: any) {
        if (event.target.files[0]) {
            const fileList: FileList = event.target.files;
            for (var i = 0; i <= fileList.length; i++) {
                this.formfiles.append('Myfiles[2]', event.target.files[i]);
            }
        }
    }
    sendCollection(form: NgForm) {
        this.saveButton = 'Processing...';
        this.CollectionService.postCollection(
            this.name,
            this.description,
            this.formfiles
        ).subscribe((x) => {
            form.reset();
            this.getAllCollections();
            this.messageService.add({
                severity: 'success',
                summary: 'Confirmed',
                detail: 'The collection was created',
            });
            this.saveButton = 'Save';
            if (!x) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Rejected',
                    detail: 'Max size for files 2MB',
                });
            }
            this.saveButton = 'Save';
        });
    }
    deleteCollection(id: string) {
        this.CollectionService.deleteCollection(id).subscribe(
            (x) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Confirmed',
                    detail: 'The collection was deleted',
                });
                this.getAllCollections();
            },
            (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Rejected',
                    detail: 'There was an error, tray again later',
                });
            }
        );
    }
}
