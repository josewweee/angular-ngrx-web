import { adapterSelectors, PokemonsState } from './../reducers/pokemons.reducer';
import { createSelector } from "@ngrx/store";
import { createFeatureSelector } from "@ngrx/store";


export const selectPokemonsState = createFeatureSelector<PokemonsState>(
  "pokemons"
);


export const selectAllPokemons = createSelector(
  selectPokemonsState,
  adapterSelectors.selectAll
)

export const arePokemonsLoaded = createSelector(
  selectPokemonsState,
  (state) => state.allPokemonsLoaded
);
