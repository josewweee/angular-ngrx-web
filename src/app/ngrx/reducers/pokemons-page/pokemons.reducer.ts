import { PokemonsPage, getPokemonId } from '../../../models/shared/pokemons-page';
import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { createReducer, on } from "@ngrx/store";
import * as PokemonsActions from "../../actions/pokemons-page/pokemons.actions";

export interface PokemonsState extends EntityState<PokemonsPage> {
  allPokemonsLoaded: boolean;
}

export const adapter = createEntityAdapter<PokemonsPage>({
  selectId: getPokemonId,
});

export const initialPokemonsState = adapter.getInitialState({
  allPokemonsLoaded: false,
});

export const pokemonsReducer = createReducer(
  initialPokemonsState,

  on(
    PokemonsActions.allPokemonsLoaded,
    (state, action) =>
      adapter.setAll(action.pokemons, { ...state, allPokemonsLoaded: true })
  ),

  on(
    PokemonsActions.nextPageLoaded,
    (state, action) => {
      return adapter.upsertMany(action.pokemons, {...state})
    }
  ),

  on(
    PokemonsActions.changeFavoriteStatus,
    (state, action) =>
      adapter.updateOne(action.update, {...state})
  )

);
export const adapterSelectors = adapter.getSelectors();

