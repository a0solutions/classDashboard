import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ShowroomsComponent } from './showrooms.component';

@NgModule({
    imports: [
        RouterModule.forChild([{ path: '', component: ShowroomsComponent }]),
    ],
    exports: [RouterModule],
})
export class PromotionsRoutingModule {}
