import { PokemonsPage } from '../../../models/shared/pokemons-page';
import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

export const loadAllPokemons = createAction(
  '[Pokemons Resolver] Load All Pokemons'
);

export const allPokemonsLoaded = createAction(
  '[Load Pokemons Effect] All Pokemons Loaded',
  props<{ pokemons: PokemonsPage[] }>()
);

export const loadNextPokemonPage = createAction(
  '[Card-list] Load Next Pokemon Page',
  props<{offset: string}>()
)

export const nextPageLoaded = createAction(
  '[Card-list] Next Pokemon Page Loaded',
  props<{pokemons: PokemonsPage[]}>()
)

export const changeFavoriteStatus = createAction(
  '[card-list] Changing Favorite Status',
  props<{update: Update<PokemonsPage>}>()
)

export const queryPokemons = createAction(
  '[card-list] Query Pokemons',
  props<{queryParameters: string}>()
)

export const changeFavoriteStatusQuery = createAction(
  '[card-list] Changing Favorite Status Query Pokemon',
  props<{pokemon: PokemonsPage}>()
)

export const clearQueryPokemons = createAction(
  '[card-list] Clear Pokemons Query'
)



