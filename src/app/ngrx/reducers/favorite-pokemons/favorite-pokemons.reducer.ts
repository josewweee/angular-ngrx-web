import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { createReducer, on } from "@ngrx/store";
import { FavoritePokemonsActions } from "../../actions/favorite-pokemons/action-types";
import { getPokemonId, PokemonsPage } from '../../../models/shared/pokemons-page';

export interface FavoritePokemonsState extends EntityState<PokemonsPage> {}

export const adapter = createEntityAdapter<PokemonsPage>({
  selectId: getPokemonId,
});

export const initialFavoritePokemonsState = adapter.getInitialState();

export const FavoritePokemonsReducer = createReducer(
  initialFavoritePokemonsState,
  on(
    FavoritePokemonsActions.addFavorite,
    (state, action) =>
      adapter.setOne(action.pokemon, {...state})
  ),

  on(
    FavoritePokemonsActions.removeFavorite,
    (state, action) =>{
      return adapter.removeOne(action.pokemon.id, {...state})
    }
  ),

  on(
    FavoritePokemonsActions.addMultipleFavorite,
    (state, action) =>
      adapter.upsertMany(action.pokemons, {...state})
  )

);
export const adapterSelectors = adapter.getSelectors();



