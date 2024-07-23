import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgModel } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { take } from 'rxjs';
import { TokenService } from 'src/app/demo/service/token.service';
import { urls } from 'src/environments/environment';
interface index {
    state: boolean;
    folders: string[];
    masterIndex?: number;
}
interface subindex {
    state: boolean;
    subfolder: index[];
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
    subfolderListColor: subindex[] = [];
    deleteProductsDialog = false;
    createdirectoryDialog = false;
    allImages: images[] = [];
    tempCategory: string;
    tempMaster: string;
    tempIndex: number;
    tempsubfolder: string;
    targetDirectory: string;
    tempFolder: string;
    isAdmin: boolean = false;
    focus: boolean[];
    constructor(
        private messageService: MessageService,
        private Imagenes: HttpClient,
        private token: TokenService,
        private confirmation: ConfirmationService
    ) {}
    ngOnInit() {
        this.getAllFolders();
        this.token.isAdmin.subscribe((x) => {
            this.isAdmin = x;
        });
    }
    getAllFolders() {
        this.Imagenes.get(this.url + '?action=folder')
            .pipe(take(1))
            .subscribe((x: any) => {
                this.allFoldersSystem = x;
                this.allFoldersSystem.forEach((y) => {
                    y.folders.forEach((element) => {
                        this.subfolderList.push({ state: false, folders: [] });
                        this.subfolderListColor.push({
                            state: false,
                            subfolder: [],
                        });
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
            x.forEach((element) => {
                this.subfolderList.push({ state: false, folders: [] });
                this.subfolderListColor[index].subfolder.push({
                    state: false,
                    folders: [],
                });
            });
        });
        this.tempMaster = folder;
    }
    getFoldersColor(
        parentFolder: string,
        folder: string,
        index: any,
        category: string,
        masterIndex: any
    ) {
        this.Imagenes.get(
            this.url +
                '?action=getfolderColor&folder=' +
                folder.replaceAll('+', '%2B') +
                '&parentFolder=' +
                parentFolder +
                '&category=' +
                category
        ).subscribe((x: any) => {
            x.forEach((element) => {
                this.subfolderListColor[masterIndex].subfolder[index].folders =
                    x;
            });
        });
        this.subfolderListColor[masterIndex].subfolder[index].state =
            !this.subfolderListColor[masterIndex].subfolder[index].state;
    }
    getImages(
        category: string,
        masterfolder: string,
        folder: string,
        subfolder: string
    ) {
        this.focus = [];
        this.allImages = [];
        this.Imagenes.get(
            this.url +
                '?category=' +
                category +
                '&folder=' +
                folder.replaceAll('+', '%2B') +
                '&parent=' +
                masterfolder +
                '&subfolder=' +
                subfolder
        ).subscribe((x: any) => {
            x.forEach((y) => {
                this.allImages.push({
                    url: (
                        urls.url +
                        'classapi/images/' +
                        category +
                        '/products/' +
                        masterfolder +
                        '/' +
                        folder +
                        '/' +
                        subfolder +
                        '/' +
                        y
                    )
                        .replaceAll('+', '%2B')
                        .replaceAll(' ', '%20'),
                    name: y,
                });
                this.focus.push(false);
            });
        });

        this.deleteProductsDialog = true;
        this.tempFolder = folder;
        this.tempsubfolder = subfolder;
    }
    deleteDirectory(
        category: string,
        masterfolder: string,
        folder?: string,
        i?: number,
        subfolder?: string,
        o?: number
    ) {
        let actualToken = this.token.getValidateToken();
        let sendUrl;
        if (!folder && !subfolder) {
            sendUrl =
                this.url +
                '?validate=' +
                actualToken +
                '&parentFolder=' +
                masterfolder +
                '&category=' +
                category;
        } else if (folder && !subfolder) {
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
                folder +
                '&subfolder=' +
                subfolder;
        }

        this.Imagenes.delete(sendUrl.replaceAll('+', '%2B')).subscribe((x) => {
            let index = 0;
            if (!folder && !subfolder) {
                this.allFoldersSystem.find((x) => {
                    if (x.category == category) {
                        x.folders.forEach((y) => {
                            if (y == masterfolder) {
                                x.folders.splice(index, 1);
                            }
                            index++;
                        });
                    }
                });
            } else if (folder && !subfolder) {
                this.subfolderList[i].folders.forEach((x) => {
                    if (x == folder) {
                        this.subfolderList[i].folders.splice(index, 1);
                    }
                    index++;
                });
            } else {
                this.subfolderListColor[i].subfolder[o].folders.forEach((x) => {
                    if (x == subfolder) {
                        this.subfolderListColor[i].subfolder[o].folders.splice(
                            index,
                            1
                        );
                    }
                    index++;
                });
            }
            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Directories was deleted',
                life: 3000,
            });
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
                    this.tempFolder.replaceAll('+', '%2B') +
                    '&subfolder=' +
                    this.tempsubfolder,
                formData
            ).subscribe({
                next: this.okUpload.bind(this),
                error: this.consoleLog.bind(this),
            });
        }
    }
    okUpload(response: any) {
        this.deleteProductsDialog = false;
    }
    consoleLog(x: any) {
        this.messageService.add({
            severity: 'error',
            summary: 'Rejected',
            detail: 'There was an error, check the format and name of the elements',
        });
        console.log(x);
    }
    deleteImage(image: images) {
        let actualToken = this.token.getValidateToken();
        this.Imagenes.delete(
            this.url +
                '?validate=' +
                actualToken +
                '&action=deleteImage&image=' +
                image.url.replaceAll('+', '%2B').replaceAll(' ', '%20')
        ).subscribe((x) => {
            x ? this.allImages.splice(this.allImages.indexOf(image), 1) : null;
            this.messageService.add({
                severity: 'error',
                summary: 'Done',
                detail: 'Image deleted',
            });
        });
    }
    confirm(
        category: string,
        masterfolder: string,
        folder?: string,
        i?: number,
        subfolder?: string,
        o?: number
    ) {
        this.confirmation.confirm({
            key: 'confirm',
            target: event.target || new EventTarget(),
            message: 'Are you sure that you want to proceed?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteDirectory(
                    category,
                    masterfolder,
                    folder,
                    i,
                    subfolder,
                    o
                );
            },
            reject: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Rejected',
                    detail: 'You have rejected',
                });
            },
        });
    }
    generateDirectories() {
        const params = new HttpParams()
            .set('validate', this.token.getValidateToken())
            .set('generate', true);
        this.Imagenes.post(this.url, true, { params }).subscribe((x) => {
            this.getAllFolders();
            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Directories generated',
                life: 3000,
            });
        });
    }
    changeImageName(oldName: string, name: string) {
        const params = new HttpParams()
            .set('validate', this.token.getValidateToken())
            .set('changeImageName', true);
        this.Imagenes.post(
            this.url,
            {
                oldName: oldName,
                name: name,
                category: this.tempCategory,
                parentRef: this.tempMaster,
                color: this.tempsubfolder,
                sets: this.tempFolder,
            },
            { params }
        ).subscribe((x) => {
            this.getImages(
                this.tempCategory,
                this.tempMaster,
                this.tempFolder,
                this.tempsubfolder
            );
            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'The name of the image was changed.',
                life: 3000,
            });
        });
    }
}
