import { selectAllFetchedPokemons } from './../../selectors/fetched-pokemons/pokemons.selector';
import { pokemonFetched } from './../../actions/fetched-pokemons/fetched-pokemons.actions';
import { PokemonService } from './../../../services/pokemons.service';
import { first, map, tap } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as FetchedPokemonsActions from "../../actions/fetched-pokemons/fetched-pokemons.actions";
import { concatMap } from "rxjs/operators";
import { select, Store } from '@ngrx/store';

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
          ).subscribe(
            pokemons => {
              let data = pokemons.find((item) => item.name === action.pokemon.name);
              if(data !== undefined)
              {

                this.store.dispatch(pokemonFetched({ pokemon: data }))
              }
              else{
                this.pokemonService.getById(action.pokemon.url)
                .pipe(
                  first()
                )
                .subscribe((pokemon) =>
                  this.store.dispatch( pokemonFetched({ pokemon }))
                )
              }
            }
          )
        })
    ),
    { dispatch: false}
  );

  /* fetchPokemon$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FetchedPokemonsActions.fetchPokemon),
      concatMap((action) => this.pokemonService.getById(action.pokemonUrl)),
      map((pokemon) => pokemonFetched({ pokemon }))
    );
  }); */

  constructor(
    private actions$: Actions,
    private pokemonService: PokemonService,
    private store: Store
  ) {}
}
