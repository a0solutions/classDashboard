import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgModel } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { TokenService } from 'src/app/demo/service/token.service';
import { urls } from 'src/environments/environment';
interface index {
    state: boolean;
    folders: string[];
}
interface images {
    url: string;
    name: string;
}
@Component({
    templateUrl: './filedemo.component.html',
    providers: [MessageService],
    styleUrls: ['./filedemo.component.css'],
})
export class FileDemoComponent {
    url = urls.urlImages;
    uploadedFiles: any[] = [];
    allFoldersSystem: any[] = [];
    subfolderList: index[] = [];
    deleteProductsDialog = false;
    createdirectoryDialog = false;
    allImages: images[] = [];
    tempCategory: string;
    tempMaster: string;
    tempIndex: number;
    targetDirectory: string;
    tempFolder: string;
    isAdmin: boolean = false;
    constructor(
        private messageService: MessageService,
        private Imagenes: HttpClient,
        private token: TokenService
    ) {}
    ngOnInit() {
        this.getAllFolders();
        this.token.isAdmin.subscribe((x) => {
            this.isAdmin = x;
        });
    }
    getAllFolders() {
        this.Imagenes.get(this.url + '?action=folder').subscribe((x: any) => {
            this.allFoldersSystem = x;
            this.allFoldersSystem.forEach((y) => {
                y.folders.forEach((element) => {
                    this.subfolderList.push({ state: false, folders: [] });
                });
            });
        });
    }
    onUpload(event: any) {
        for (const file of event.files) {
            this.uploadedFiles.push(file);
        }

        this.messageService.add({
            severity: 'info',
            summary: 'Success',
            detail: 'File Uploaded',
        });
    }

    onBasicUpload() {
        this.messageService.add({
            severity: 'info',
            summary: 'Success',
            detail: 'File Uploaded with Basic Mode',
        });
    }
    getFolders(folder: string, index: any, category: string) {
        this.subfolderList[index].state = !this.subfolderList[index].state;
        this.Imagenes.get(
            this.url +
                '?action=getfolder&folder=' +
                folder +
                '&category=' +
                category
        ).subscribe((x: any) => {
            this.subfolderList[index].folders = x;
        });
        this.tempMaster = folder;
    }
    getImages(category: string, masterfolder: string, folder: string) {
        this.allImages = [];
        this.Imagenes.get(
            this.url +
                '?category=' +
                category +
                '&folder=' +
                folder +
                '&parent=' +
                masterfolder
        ).subscribe((x: any) => {
            x.forEach((y) => {
                this.allImages.push({
                    url:
                        urls.url +
                        'classapi/images/' +
                        category +
                        '/products/' +
                        masterfolder +
                        '/' +
                        folder +
                        '/' +
                        y,
                    name: y,
                });
            });
        });

        this.deleteProductsDialog = true;
        this.tempFolder = folder;
    }
    deleteDirectory(
        category: string,
        masterfolder: string,
        folder?: string,
        i?: number
    ) {
        let actualToken = this.token.getValidateToken();
        let sendUrl;
        if (!folder) {
            sendUrl =
                this.url +
                '?validate=' +
                actualToken +
                '&parentFolder=' +
                masterfolder +
                '&category=' +
                category;
        } else {
            sendUrl =
                this.url +
                '?validate=' +
                actualToken +
                '&parentFolder=' +
                masterfolder +
                '&category=' +
                category +
                '&folder=' +
                folder;
        }

        this.Imagenes.delete(sendUrl).subscribe((x) => {
            let index = 0;
            if (!folder) {
                this.allFoldersSystem.find((x) => {
                    if (x.category == category) {
                        x.folders.forEach((y) => {
                            if (y == masterfolder) {
                                x.folders.splice(index, 1);
                                console.log(masterfolder);
                            }
                            index++;
                        });
                    }
                });
            } else {
                this.subfolderList[i].folders.forEach((x) => {
                    if (x == folder) {
                        this.subfolderList[i].folders.splice(index, 1);
                    }
                    index++;
                });
            }
        });
    }
    createDirectory(category: string, masterfolder: string, i?: number) {
        this.createdirectoryDialog = true;
        this.tempCategory = category;
        this.tempMaster = masterfolder;
        this.tempIndex = i;
        this.targetDirectory = 'folder';
    }
    confirmCreateDirectory(folder: NgModel) {
        let actualToken = this.token.getValidateToken();
        let sendUrl =
            this.url +
            '?validate=' +
            actualToken +
            '&parentFolder=' +
            this.tempMaster +
            '&category=' +
            this.tempCategory +
            '&folder=' +
            folder.value +
            '&target=' +
            this.targetDirectory;
        this.Imagenes.post(sendUrl, folder.value).subscribe((x) => {
            if (this.targetDirectory != 'master') {
                this.subfolderList[this.tempIndex].folders.push(folder.value);
            } else {
                this.allFoldersSystem.forEach((x) => {
                    if (x.category == this.tempCategory) {
                        x.folders.push(folder.value);
                    }
                });
            }

            this.createdirectoryDialog = false;
            folder.reset();
        });
    }
    createMasterDirectory(category: string) {
        this.createdirectoryDialog = true;
        this.tempCategory = category;
        this.targetDirectory = 'master';
    }
    uploadFiles(event: any) {
        let actualToken = this.token.getValidateToken();
        if (event.target.files[0]) {
            const formData = new FormData();
            const fileList: FileList = event.target.files;
            for (var i = 0; i <= fileList.length; i++) {
                formData.append('MyProducts[]', event.target.files[i]);
            }
            this.Imagenes.post(
                this.url +
                    '?validate=' +
                    actualToken +
                    '&parentFolder=' +
                    this.tempMaster +
                    '&category=' +
                    this.tempCategory +
                    '&folder=' +
                    this.tempFolder,
                formData
            ).subscribe({
                next: this.okUpload.bind(this),
                error: this.consoleLog.bind(this),
            });
        }
    }
    okUpload() {
        this.deleteProductsDialog = false;
    }
    consoleLog(x: any) {
        console.log(x);
    }
}
