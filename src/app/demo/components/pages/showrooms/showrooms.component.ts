import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Promotion } from 'src/app/demo/api/customer';
import { Product } from 'src/app/demo/api/product';
import { CategoriesService } from 'src/app/demo/service/categories.service';
import { PhotoService } from 'src/app/demo/service/photo.service';
import { ProductService } from 'src/app/demo/service/product.service';
import {
    popup,
    showrooms,
    ShowroomsService,
} from 'src/app/demo/service/showrooms.service';
import { TokenService } from 'src/app/demo/service/token.service';
import { urls } from 'src/environments/environment';

@Component({
    templateUrl: './showrooms.component.html',
    providers: [MessageService],
    styleUrls: ['./showrooms.component.css'],
})
export class ShowroomsComponent implements OnInit {
    url: string = urls.urlContact;
    ImageHideDialog: boolean = false;
    imageModal: string;
    allShowrooms: showrooms[] = [];
    allCategories: any;
    popupsSelected: popup[] = [];
    showroomSelected: showrooms;
    popupSelected: popup;
    referenceSelected: string;
    popupOffset: number;
    createModalDialog: boolean = false;
    valRadio: string;
    formfiles = new FormData();
    tempId: string;
    //*********************** Notifications Properties */
    referenceHideDialog = false;
    promotionDialog: boolean = false;
    promotionSelected: Promotion = <Promotion>{};
    deleteHideDialog: boolean = false;
    temp: any;
    tempSelectedPromo: Promotion;

    flag: string = '';
    isAdmin: boolean = false;

    images!: any[];
    products: Product[];
    galleriaResponsiveOptions: any[] = [
        {
            breakpoint: '1024px',
            numVisible: 5,
        },
        {
            breakpoint: '960px',
            numVisible: 4,
        },
        {
            breakpoint: '768px',
            numVisible: 3,
        },
        {
            breakpoint: '560px',
            numVisible: 1,
        },
    ];

    carouselResponsiveOptions: any[] = [
        {
            breakpoint: '1024px',
            numVisible: 3,
            numScroll: 3,
        },
        {
            breakpoint: '768px',
            numVisible: 2,
            numScroll: 2,
        },
        {
            breakpoint: '560px',
            numVisible: 1,
            numScroll: 1,
        },
    ];
    constructor(
        private messageService: MessageService,
        private productService: ProductService,
        private token: TokenService,
        private photoService: PhotoService,
        private showroomService: ShowroomsService,
        private categoriesService: CategoriesService
    ) {}

    ngOnInit() {
        this.categoriesService.getCategories().subscribe((x) => {
            this.allCategories = x;
        });
        this.showroomService.getShowrooms().subscribe((x) => {
            this.allShowrooms = <showrooms[]>x;
        });
        this.productService.getProductsSmall().then((products) => {
            this.products = products;
        });

        this.photoService.getImages().then((images) => {
            this.images = images;
        });
    }
    filterShowrooms(categorySelected: string) {
        return this.allShowrooms.filter((x) => x.category === categorySelected);
    }
    settingPin(mouseEvent: any) {
        let imgWidth = mouseEvent.target.clientWidth;
        let imgHeight = mouseEvent.target.clientHeight;

        let leftPosition = mouseEvent.offsetX;
        let topPosition = mouseEvent.offsetY;

        let newtop =
            parseFloat(((topPosition * 100) / imgHeight).toFixed(3)) - 1;
        let newleft =
            parseFloat(((leftPosition * 100) / imgWidth).toFixed(3)) - 1;

        this.popupSelected = { top: newtop, left: newleft, reference: '' };

        this.popupsSelected.push(this.popupSelected);
        this.popupOffset = this.popupsSelected.length - 1;
        this.referenceHideDialog = true;
    }
    confirmPopupChange() {
        this.popupsSelected[this.popupOffset].reference =
            this.referenceSelected;
        this.referenceSelected = '';
        this.referenceHideDialog = false;

        this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Pin updated',
            life: 3000,
        });
    }
    deletePin() {
        this.popupsSelected.splice(this.popupOffset, 1);
        this.referenceSelected = '';
        this.referenceHideDialog = false;
        this.messageService.add({
            severity: 'error',
            summary: 'Successful',
            detail: 'Pin deleted',
            life: 3000,
        });
    }
    updatePin(offset: number) {
        this.popupOffset = offset;
        this.referenceSelected =
            this.popupsSelected[this.popupOffset].reference;
        this.referenceHideDialog = true;
    }
    openImageModal(showroom: any) {
        this.showroomSelected = showroom;
        this.imageModal = this.showroomSelected.img;
        if (this.showroomSelected.popups != '') {
            this.popupsSelected = JSON.parse(this.showroomSelected.popups);
        } else {
            this.popupsSelected = <popup[]>[];
        }

        this.ImageHideDialog = true;
    }
    hideDialog() {
        this.promotionDialog = false;
        this.deleteHideDialog = false;
    }

    confirmSaveShowroomChanges() {
        this.showroomSelected.popups = JSON.stringify(this.popupsSelected);
        this.showroomService
            .setShowroom(this.showroomSelected)
            .subscribe((x) => {
                if (x) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Showroom updated',
                        life: 3000,
                    });
                    this.ImageHideDialog = false;
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'An unexpected error occurred. Please try again later',
                        life: 3000,
                    });
                }
            });
    }

    uploadImage(event: any) {
        if (event.target.files[0]) {
            const fileList: FileList = event.target.files;
            for (var i = 0; i <= fileList.length; i++) {
                this.formfiles.append('Myfiles[1]', event.target.files[i]);
            }
        }
    }
    createNewShowroom(form: NgForm) {
        if (form.valid && this.formfiles.get('Myfiles[1]')) {
            this.showroomService
                .postShowroom(
                    this.formfiles,
                    form.value.showroomName,
                    form.value.category
                )
                .subscribe(
                    (x) => {
                        if (x == 'size') {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'The image should be 1920px x 1080px. Please change the dimensions of the picture and try again.',
                                life: 3000,
                            });
                        } else {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Successful',
                                detail: 'The showroom was created successfully.',
                                life: 3000,
                            });
                            this.allShowrooms = <showrooms[]>x;
                            form.reset();
                            this.createModalDialog = false;
                        }
                    },
                    (error) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'An unexpected error occurred. Please try again later',
                            life: 3000,
                        });
                        console.log(error);
                    }
                );
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'All input are requiered',
                life: 3000,
            });
        }
    }
    deleteShowroom(showroom: showrooms) {
        this.showroomSelected = showroom;
        this.deleteHideDialog = true;
    }
    confirm() {
        this.showroomService
            .deleteShowroom(this.showroomSelected)
            .subscribe((x) => {
                this.allShowrooms = <showrooms[]>x;
                this.deleteHideDialog = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Deleted',
                    detail: 'The showroom was deleted successfully.',
                    life: 3000,
                });
                console.log(x);
            });
    }
}
