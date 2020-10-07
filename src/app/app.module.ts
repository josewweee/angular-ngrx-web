import { PokemonDataService } from './services/pokemon-data.service';
import { PokemonEntityService } from './services/pokemon-entity.service';
import { PokemonsResolver } from './ngrx/pokemons.resolver';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BannerComponent } from './components/banner/banner.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { CardListComponent } from './components/card-list/card-list.component';
import { SingleCardOverviewComponent } from './components/single-card-overview/single-card-overview.component';
import { MultipleCardOverviewComponent } from './components/multiple-card-overview/multiple-card-overview.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  EntityDataModule,
  EntityDataService,
  EntityDefinitionService,
} from '@ngrx/data';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { RouterState, StoreRouterConnectingModule } from '@ngrx/router-store';
import { EffectsModule } from '@ngrx/effects';
import { HttpClientModule } from '@angular/common/http';
import { entityMetadata } from './ngrx/entity-metadata';

import { environment } from 'src/environments/environment';

import { IvyCarouselModule } from 'angular-responsive-carousel';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';

@NgModule({
  declarations: [
    AppComponent,
    BannerComponent,
    NavBarComponent,
    CardListComponent,
    SingleCardOverviewComponent,
    MultipleCardOverviewComponent,
  ],
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
    IvyCarouselModule,
    MatToolbarModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatGridListModule,
  ],
  providers: [PokemonsResolver, PokemonEntityService, PokemonDataService],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(
    private entityDataService: EntityDataService,
    private pokemonDataService: PokemonDataService
  ) {
    entityDataService.registerService('Pokemons', pokemonDataService);
  }
}
