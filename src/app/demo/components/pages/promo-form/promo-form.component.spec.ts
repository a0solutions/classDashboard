/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PromoFormComponent } from './promo-form.component';

describe('CrudFormComponent', () => {
    let component: PromoFormComponent;
    let fixture: ComponentFixture<PromoFormComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PromoFormComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PromoFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
