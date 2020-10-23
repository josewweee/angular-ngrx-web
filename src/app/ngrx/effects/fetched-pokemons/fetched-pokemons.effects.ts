import { FetchedPokemonsHttp } from './../../../services/fetched-pokemons-http/fetched-pokemons-http.service';
import { selectAllFetchedPokemons } from '../../selectors/fetched-pokemons/fetched-pokemons.selector';
import { pokemonFetched } from '../../actions/fetched-pokemons/fetched-pokemons.actions';
import { first, map, switchMap, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as FetchedPokemonsActions from '../../actions/fetched-pokemons/fetched-pokemons.actions';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';

@Injectable()
export class FetchedPokemonsEffects {

  fetchPokemon$ = createEffect(
    () =>
    this.actions$.pipe(
      ofType(FetchedPokemonsActions.fetchPokemon),
      switchMap((action) => {
        return this.store.pipe(
          select(selectAllFetchedPokemons),
          first(),
          switchMap(pokemons => {
            let data = pokemons.find((item) => item.name === action.pokemon.name);
            if (data !== undefined) {
              return of(pokemonFetched({ pokemon: data }))
            } else {
              return this.pokemonService.getById(action.pokemon.url)
              .pipe(
                first(),
                map((pokemon) => pokemonFetched({ pokemon }))
              )
            }
          })
        )
      })
    )
  );

 constructor(
    private actions$: Actions,
    private pokemonService: FetchedPokemonsHttp,
    private store: Store
  ) {}
}
