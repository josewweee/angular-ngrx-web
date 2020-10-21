import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { createReducer, on } from "@ngrx/store";
import * as FetchedPokemonsActions from "../../actions/fetched-pokemons/fetched-pokemons.actions";
import { Pokemon } from '../../../models/shared/pokemon';

export interface FetchedPokemonsState extends EntityState<Pokemon> {
  fetchingPokemon: boolean;
}

export const adapter = createEntityAdapter<Pokemon>({

});

export const initialFetchedPokemonsState = adapter.getInitialState({
  fetchingPokemon: false
});

export const fetchedPokemonsReducer = createReducer(
  initialFetchedPokemonsState,

  on(
    FetchedPokemonsActions.fetchPokemon,
    (state, action) => {
      return {...state, fetchingPokemon: true}
    }
  ),

  on(
    FetchedPokemonsActions.pokemonFetched,
    (state, action) =>
      adapter.setOne(action.pokemon, {...state, fetchingPokemon: false})
  )

);
export const adapterSelectors = adapter.getSelectors();

