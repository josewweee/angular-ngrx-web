import { FetchedPokemonsHttp } from './../services/fetched-pokemons-http/fetched-pokemons-http.service';
import { PokemonService } from '../services/pokemons-http/pokemons.service';
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
    FetchedPokemonsHttp
  ],
})
export class CoreModule {}
