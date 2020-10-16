import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { EntityDataModule } from '@ngrx/data';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { entityMetadata } from './ngrx/entity-metadata';

import { CoreModule } from './core/core.module';
import { HomeModule } from './components/home/home.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BannerComponent } from './components/banner/banner.component';
import { environment } from 'src/environments/environment';

import { IvyCarouselModule } from 'angular-responsive-carousel';

@NgModule({
  declarations: [AppComponent, BannerComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,

    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    EntityDataModule.forRoot({ entityMetadata: entityMetadata }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    HomeModule,
    CoreModule,
    IvyCarouselModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
