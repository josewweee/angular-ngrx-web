import { fetchedPokemonsReducer } from '../../ngrx/reducers/fetched-pokemons/pokemons.reducer';
import { FetchedPokemonsEffects } from '../../ngrx/effects/fetched-pokemons/pokemons.effects';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('fetchedPokemons', fetchedPokemonsReducer),
    EffectsModule.forFeature([FetchedPokemonsEffects]),
  ]
})
export class FetchedPokemonsModule { }
