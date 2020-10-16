import { GraphService } from './../services/graphs/graph.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntityDataService } from '@ngrx/data';

import { FavoriteEntityService } from '../services/favorite-pokemons/favorite-entity.service';
import { FetchedPokemonsDataService } from '../services/fetched-pokemons/fetched-pokemons-data.service';
import { FetchedPokemonsEntityService } from '../services/fetched-pokemons/fetched-pokemons-entity.service';
import { PokemonDataService } from '../services/pokemons-page/pokemon-data.service';
import { PokemonEntityService } from '../services/pokemons-page/pokemon-entity.service';
import { PokemonsResolver } from '../ngrx/pokemons.resolver';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    PokemonsResolver,
    PokemonEntityService,
    PokemonDataService,
    FetchedPokemonsEntityService,
    FetchedPokemonsDataService,
    FavoriteEntityService,
    GraphService,
  ],
})
export class CoreModule {
  constructor(
    private entityDataService: EntityDataService,
    private pokemonDataService: PokemonDataService,
    private fetchedPokemonsDataService: FetchedPokemonsDataService
  ) {
    entityDataService.registerService('Pokemons', pokemonDataService);
    entityDataService.registerService(
      'FetchedPokemons',
      fetchedPokemonsDataService
    );
  }
}
