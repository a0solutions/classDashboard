import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'products',
                loadChildren: () =>
                    import('./products/crud.module').then((m) => m.CrudModule),
            },
            {
                path: 'orders',
                loadChildren: () =>
                    import('./orders/emptydemo.module').then(
                        (m) => m.EmptyDemoModule
                    ),
            },
            {
                path: 'notification',
                loadChildren: () =>
                    import('./notification/notification.module').then(
                        (m) => m.NotificationModule
                    ),
            },
            {
                path: 'promotions',
                loadChildren: () =>
                    import('./promotions/promotions.module').then(
                        (m) => m.PromotionsModule
                    ),
            },
            {
                path: 'users',
                loadChildren: () =>
                    import('./users/users.module').then((m) => m.UsersModule),
            },
            {
                path: 'timeline',
                loadChildren: () =>
                    import('./timeline/timelinedemo.module').then(
                        (m) => m.TimelineDemoModule
                    ),
            },
            {
                path: 'categories',
                loadChildren: () =>
                    import('./categories/categories.module').then(
                        (m) => m.CategoriesModule
                    ),
            },
            {
                path: 'collections',
                loadChildren: () =>
                    import('./collections/collections.module').then(
                        (m) => m.CollectionsModule
                    ),
            },
            { path: '**', redirectTo: '/notfound' },
        ]),
    ],
    exports: [RouterModule],
})
export class PagesRoutingModule {}
