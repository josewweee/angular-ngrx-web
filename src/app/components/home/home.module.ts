import { PokemonsEffects } from '../../ngrx/effects/pokemons-page/pokemons.effects';
import { pokemonsReducer } from '../../ngrx/reducers/pokemons-page/pokemons.reducer';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from '../../app-routing.module';

import { CardListComponent } from './card-list/card-list.component';
import { MultipleCardOverviewComponent } from './multiple-card-overview/multiple-card-overview.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { SingleCardOverviewComponent } from './single-card-overview/single-card-overview.component';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  declarations: [
    CardListComponent,
    MultipleCardOverviewComponent,
    NavBarComponent,
    SingleCardOverviewComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    AppRoutingModule,
    MatToolbarModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatGridListModule,
    InfiniteScrollModule,
    NgxUiLoaderModule,
    StoreModule.forFeature("pokemons", pokemonsReducer),
    EffectsModule.forFeature([PokemonsEffects]),
  ],
  exports: [
    CommonModule,
    CardListComponent,
    MultipleCardOverviewComponent,
    NavBarComponent,
    SingleCardOverviewComponent,
  ],
})
export class HomeModule {}

