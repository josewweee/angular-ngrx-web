import { PokemonsPage } from 'src/app/models/shared/pokemons-page';
import { adapterSelectors, PokemonsState } from '../../reducers/pokemons-page/pokemons.reducer';
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
  (state) => {
    return state.allPokemonsLoaded
  }
);

export const searchPokemons = createSelector(
  selectPokemonsState,
  (state) =>{
    return (state.queryPokemons)
  }
)
