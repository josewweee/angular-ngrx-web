import { FavoritePokemonsEffects } from './../../ngrx/effects/favorite-pokemons/favorite-pokemons.effects';
import { FavoritePokemonsReducer } from './../../ngrx/reducers/favorite-pokemons/favorite-pokemons.reducer';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('favoritePokemons', FavoritePokemonsReducer),
    EffectsModule.forFeature([FavoritePokemonsEffects]),
  ]
})
export class FavoritePokemonsModule { }
