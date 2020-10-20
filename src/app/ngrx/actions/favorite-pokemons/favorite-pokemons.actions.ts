import { Pokemon } from '../../../models/shared/pokemon';
import { createAction, props } from "@ngrx/store";
import { PokemonsPage } from 'src/app/models/shared/pokemons-page';


/* export const fetchPokemon = createAction(
  "[Card-list] Fetch Pokemon",
  props<{pokemonUrl: string}>()
)
 */

 export const addFavorite = createAction(
   "[Card-list] Add Favorite",
   props<{pokemon: PokemonsPage}>()
 );

 export const removeFavorite = createAction(
  "[Card-list] Remove Favorite",
  props<{pokemon: PokemonsPage}>()
);

export const addMultipleFavorite = createAction(
  "[Banner] Add Multiple Favorites",
  props<{pokemons: PokemonsPage[]}>()
);
