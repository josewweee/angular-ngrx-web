import { Pokemon } from '../../../models/shared/pokemon';
import { createAction, props } from "@ngrx/store";


export const fetchPokemon = createAction(
  "[Card-list] Fetch Pokemon",
  props<{pokemonUrl: string}>()
)

export const pokemonFetched = createAction(
  "[Fetch Pokemon Effects] Pokemon Fetched",
  props<{pokemon: Pokemon}>()
)

