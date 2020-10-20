import { FavoritePokemonsModule } from './core/entities-modules/favorite-pokemons.module';
import { FetchedPokemonsModule } from './core/entities-modules/fetched-pokemons.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { reducers } from './ngrx/reducers/pokemons-page/index'

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

    StoreModule.forRoot(reducers,{}),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    HomeModule,
    FetchedPokemonsModule,
    FavoritePokemonsModule,
    CoreModule,
    IvyCarouselModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
