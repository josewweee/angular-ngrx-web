import { pokemonsReducer } from './../../ngrx/reducers/pokemons-page/pokemons.reducer';
import { PokemonsEffects } from './../../ngrx/effects/pokemons-page/pokemons.effects';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('pokemons', pokemonsReducer),
    EffectsModule.forFeature([PokemonsEffects]),
  ]
})
export class PokemonsModule { }
