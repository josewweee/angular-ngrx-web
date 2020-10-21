import { PokemonService } from './../services/pokemons.service';
import { GraphService } from './../services/graphs/graph.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PokemonsResolver } from '../ngrx/resolvers/pokemons.resolver';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    PokemonsResolver,
    GraphService,
    PokemonService,
  ],
})
export class CoreModule {}
