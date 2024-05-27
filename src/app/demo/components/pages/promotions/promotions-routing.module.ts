import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PromotionsComponent } from './promotions.component';

@NgModule({
    imports: [
        RouterModule.forChild([{ path: '', component: PromotionsComponent }]),
    ],
    exports: [RouterModule],
})
export class PromotionsRoutingModule {}
