import { selectAllFetchedPokemons } from '../../selectors/fetched-pokemons/fetched-pokemons.selector';
import { pokemonFetched } from '../../actions/fetched-pokemons/fetched-pokemons.actions';
import { PokemonService } from '../../../services/pokemons.service';
import { first, switchMap, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as FetchedPokemonsActions from '../../actions/fetched-pokemons/fetched-pokemons.actions';
import { select, Store } from '@ngrx/store';
import { Pokemon } from 'src/app/models/shared/pokemon';
import { EMPTY } from 'rxjs';

@Injectable()
export class FetchedPokemonsEffects {

fetchPokemon$ = createEffect(
  () =>
    this.actions$.pipe(
      ofType(FetchedPokemonsActions.fetchPokemon),
      tap(
        (action) =>
        {
        this.store.pipe(
          select(selectAllFetchedPokemons),
          first(),
          switchMap(pokemons => {
            let data = pokemons.find((item) => item.name === action.pokemon.name);
            if(data !== undefined)
            {
              this.store.dispatch(pokemonFetched({ pokemon: data }))
              return EMPTY
            } else {
              return this.pokemonService.getById(action.pokemon.url)
              .pipe(
                first()
              )
            }
          })
        )
        .subscribe((pokemon) =>
          this.store.dispatch( pokemonFetched({ pokemon }))
        )
      })
  ),
  { dispatch: false}
);

 constructor(
    private actions$: Actions,
    private pokemonService: PokemonService,
    private store: Store
  ) {}
}
