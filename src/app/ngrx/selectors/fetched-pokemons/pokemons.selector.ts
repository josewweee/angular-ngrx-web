import { FetchedPokemonsState, adapterSelectors, adapter } from './../../reducers/fetched-pokemons/pokemons.reducer';
import { createSelector } from "@ngrx/store";
import { createFeatureSelector } from "@ngrx/store";


export const selectFetchedPokemonsState = createFeatureSelector<FetchedPokemonsState>(
  "fetchedPokemons"
);


export const selectAllFetchedPokemons = createSelector(
  selectFetchedPokemonsState,
  adapterSelectors.selectAll
);

export const fetchingInProcess = createSelector(
  selectFetchedPokemonsState,
  (state) => state.fetchingPokemon
)
