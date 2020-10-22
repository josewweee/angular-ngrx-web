import { FavoritePokemonsState } from '../../reducers/favorite-pokemons/favorite-pokemons.reducer';
import { adapterSelectors } from '../../reducers/favorite-pokemons/favorite-pokemons.reducer';
import { createSelector } from '@ngrx/store';
import { createFeatureSelector } from '@ngrx/store';

export const selectFavoritePokemonsState = createFeatureSelector<FavoritePokemonsState>(
  'favoritePokemons'
);

export const selectAllFavoritePokemons = createSelector(
  selectFavoritePokemonsState,
  adapterSelectors.selectAll
);
