import { changeFavoriteStatus, changeFavoriteStatusQuery } from './../../ngrx/actions/pokemons-page/pokemons.actions';
import { first, map, tap } from 'rxjs/operators';
import { selectAllFavoritePokemons } from './../../ngrx/selectors/favorite-pokemons/favorite-pokemons.selector';
import { PokemonsPage } from './../../models/shared/pokemons-page';
import { select, Store } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { addFavorite, removeFavorite } from '../../ngrx/actions/favorite-pokemons/favorite-pokemons.actions';

export class FavoritesUtils{

  static addFavorites(pokemon: PokemonsPage, store: Store, QueryStatus?: string): favoritesAddedResponse {
    let favoritesLength: number;
    let removingFavorite: boolean = false;
    let isAQuery: boolean = (QueryStatus !== undefined && QueryStatus !== '')? true: false;
    let response: favoritesAddedResponse = {
      status: null
    };

    store.pipe(
      select(selectAllFavoritePokemons),
      first(),
      map( (favorites: PokemonsPage[]) => {
        favoritesLength = favorites.length;

        if(favorites.some((item) => item.name === pokemon.name)) {
          removingFavorite = true;
        }
      })
    ).subscribe(() => {
      if (removingFavorite) {
        const newPokemon: PokemonsPage = { ...pokemon, isFavorite: false };
        const updatedPokemon: Update<PokemonsPage> = {
          id: pokemon.id,
          changes: newPokemon
        }
        response.status = false;
        const newActionRemovingFavorite = removeFavorite({pokemon: newPokemon})
        const newActionChangeFavoriteStatus = changeFavoriteStatus({update: updatedPokemon})
        store.dispatch(newActionRemovingFavorite);
        store.dispatch(newActionChangeFavoriteStatus);
        /* if(isAQuery){
          const newActionChangeFavoriteStatusQueryPokemon = changeFavoriteStatusQuery({pokemon: newPokemon})
          store.dispatch(newActionChangeFavoriteStatusQueryPokemon);
        } */
      } else {
        if (favoritesLength !== undefined && favoritesLength >= 5) {
          console.warn(`Favorite Limit Reached`);
          response.status = null;
        } else {
          const newPokemon: PokemonsPage = { ...pokemon, isFavorite: true };
          const updatedPokemon: Update<PokemonsPage> = {
            id: pokemon.id,
            changes: newPokemon
          }
          response.status = true;
          const newActionAddingFavorite = addFavorite({pokemon: newPokemon})
          const newActionChangeFavoriteStatus = changeFavoriteStatus({update: updatedPokemon})
          store.dispatch(newActionAddingFavorite);
          store.dispatch(newActionChangeFavoriteStatus);
         /*  if(isAQuery){
            const newActionChangeFavoriteStatusQueryPokemon = changeFavoriteStatusQuery({pokemon: newPokemon})
            store.dispatch(newActionChangeFavoriteStatusQueryPokemon);
          } */
        }
      }
    });
    return response;
  }
}


interface favoritesAddedResponse{
  status: boolean
}
