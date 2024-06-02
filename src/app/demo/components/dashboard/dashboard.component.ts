import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Product } from '../../api/product';
import { ProductService } from '../../service/product.service';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import {
    OrdersService,
    cartProduct,
    order,
} from '../../service/orders.service';
import { LoginService } from '../../service/login.service';
import { NotificationsService } from '../../service/notifications.service';
import { Notification, Users } from '../../api/customer';
import { SelectButton } from 'primeng/selectbutton';
interface BestSellers {
    reference: string;
    name: string;
    count: number;
}
@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
    items!: MenuItem[];

    products!: Product[];

    chartData: any;

    chartOptions: any;
    recentSales: order[] = [];
    subscription!: Subscription;
    notificationSubscription: Subscription;
    usersSubscription: Subscription;
    ordersSubscription: Subscription;
    productsSubscription: Subscription;
    orderNumber: number = 0;
    totalSold: number = 0;
    totalSoldThisMonth: number = 0;
    totalSoldLastMonth: number = 0;
    totalUsersThisMonth: number = 0;
    totalUsersLastMonth: number = 0;
    totalUsers: number = 0;
    unreadNotificationsNumber: number = 0;
    unreadNotifications: Notification[] = [];
    respondedNotifications: number = 0;
    allNotifications: Notification[] = [];
    topFiveProducts: Product[] = [];
    private tempProduct: Product[] = [];
    private tempIDS: BestSellers[] = [];
    bestSellers: BestSellers[] = [];
    constructor(
        private productService: ProductService,
        public layoutService: LayoutService,
        private orders: OrdersService,
        private users: LoginService,
        private notifications: NotificationsService
    ) {
        this.subscription = this.layoutService.configUpdate$.subscribe(() => {
            this.initChart();
        });
        this.notificationSubscription = this.notifications
            .getAllNotifications()
            .subscribe((x: Notification[]) => {
                this.allNotifications = x;
                this.unreadNotifications = x.filter((y: any) => y.status == 0);
                this.unreadNotificationsNumber = x.filter(
                    (y: any) => y.status == 0
                ).length;
                this.respondedNotifications =
                    x.length - this.unreadNotificationsNumber;
            });
        this.usersSubscription = this.users
            .getAllUsers()
            .subscribe((x: Users[]) => {
                this.totalUsers = x.length;
                x.forEach((y) => {
                    this.isThisMonth(y.date)
                        ? this.totalUsersThisMonth++
                        : this.isLastMonth(y.date)
                        ? this.totalUsersLastMonth++
                        : null;
                });
            });
        this.ordersSubscription = this.orders.getAllOrders().subscribe({
            next: this.setAllValues.bind(this),
            error: console.log.bind(this),
        });
    }

    ngOnInit() {
        this.initChart();
        this.productService
            .getProductsSmall()
            .then((data) => (this.products = data));

        this.items = [
            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
            { label: 'Remove', icon: 'pi pi-fw pi-minus' },
        ];
    }
    setAllValues(data: order[]): void {
        this.orderNumber = data.length;
        for (let i = 0; i < data.length; i++) {
            let currentProduct = data[i];
            if (this.isPlaced(currentProduct)) {
                this.recentSales.push(currentProduct);
                this.orders.placedOrders.next(this.recentSales.length);
            }
            this.isThisMonth(currentProduct.date)
                ? (this.totalSoldThisMonth =
                      this.totalSoldThisMonth * 1 + currentProduct.amount * 1)
                : this.isLastMonth(currentProduct.date)
                ? (this.totalSoldLastMonth =
                      this.totalSoldLastMonth * 1 + currentProduct.amount * 1)
                : null;
            this.isThisYear(currentProduct.date)
                ? (this.totalSold = this.totalSold + currentProduct.amount * 1)
                : null;
            currentProduct.cartProducts.forEach((z: cartProduct) => {
                this.manageAllTop5Products(z);
            });
        }
        this.selectTheBest5();
    }
    manageAllTop5Products(product: cartProduct): void {
        this.tempProduct.push(product.product);
        let tempSeller: BestSellers = <BestSellers>{};
        let foundProduct = this.tempIDS.find(
            (x) => x.reference == product.product.reference
        );
        if (foundProduct == undefined) {
            tempSeller.reference = product.product.reference;
            tempSeller.count = product.count;
            tempSeller.name = product.product.name;
            this.tempIDS.push(tempSeller);
        } else {
            this.tempIDS.find(
                (x) => x.reference == product.product.reference
            ).count = foundProduct.count + product.count;
        }
    }
    selectTheBest5(): void {
        this.tempIDS.sort((a, b) => {
            return b.count - a.count;
        });
        this.tempIDS.splice(5, this.tempIDS.length);
        this.bestSellers = this.tempIDS;
    }
    isThisYear(date: any): boolean {
        let tempTime = parseInt(date.substr(0, 4));
        let currentTime = new Date().getFullYear();
        if (tempTime === currentTime) return true;
        return false;
    }
    isThisMonth(date: any): boolean {
        let tempTime = parseInt(date.substr(5, 2));
        let currentTime = new Date().getMonth() + 1;
        if (tempTime === currentTime) return true;
        return false;
    }
    isLastMonth(date: any): boolean {
        let tempTime = parseInt(date.substr(5, 2));
        let currentTime = new Date().getMonth() + 1;
        if (tempTime === currentTime - 1) return true;
        return false;
    }
    isPlaced(order: order): boolean {
        if (
            order.atelier == '' &&
            order.finale == '' &&
            order.canceled == '' &&
            order.delivered == '' &&
            order.roadshow == ''
        )
            return true;
        return false;
    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue(
            '--text-color-secondary'
        );
        const surfaceBorder =
            documentStyle.getPropertyValue('--surface-border');

        this.chartData = {
            labels: [
                'January',
                'Febrary',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'Spetember',
                'October',
                'November',
                'December',
            ],
            datasets: [
                {
                    label: 'Current Year',
                    data: [5, 30, 10, 1, 40, 45, 12, 103, 12, 45, 5, 12],
                    fill: false,
                    backgroundColor:
                        documentStyle.getPropertyValue('--bluegray-700'),
                    borderColor:
                        documentStyle.getPropertyValue('--bluegray-700'),
                    tension: 0.4,
                },
                {
                    label: 'Last Year',
                    data: [15, 34, 18, 12, 49, 51, 19, 57, 25, 57, 51, 23],
                    fill: false,
                    backgroundColor:
                        documentStyle.getPropertyValue('--green-600'),
                    borderColor: documentStyle.getPropertyValue('--green-600'),
                    tension: 0.4,
                },
            ],
        };

        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                    },
                },
                y: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                    },
                },
            },
        };
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.notificationSubscription.unsubscribe();
        this.usersSubscription.unsubscribe();
        this.ordersSubscription.unsubscribe();
    }
}
