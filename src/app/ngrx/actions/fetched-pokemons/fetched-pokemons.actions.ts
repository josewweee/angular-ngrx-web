import { Pokemon } from '../../../models/shared/pokemon';
import { createAction, props } from "@ngrx/store";
import { PokemonsPage } from 'src/app/models/shared/pokemons-page';


export const fetchPokemon = createAction(
  "[Card-list] Fetch Pokemon",
  props<{pokemon: PokemonsPage}>()
)

export const pokemonFetched = createAction(
  "[Fetch Pokemon Effects] Pokemon Fetched",
  props<{pokemon: Pokemon}>()
)

