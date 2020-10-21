import { select, Store } from '@ngrx/store';
import { allPokemonsLoaded, nextPageLoaded } from '../../actions/pokemons-page/pokemons.actions';
import { PokemonService } from '../../../services/pokemons.service';
import { first, map, tap } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as PokemonsActions from "../../actions/pokemons-page/pokemons.actions";
import { concatMap } from "rxjs/operators";
import { arePokemonsLoaded } from '../../selectors/pokemons-page/pokemons.selector';
import { PokemonsPage } from 'src/app/models/shared/pokemons-page';

@Injectable()
export class PokemonsEffects {
  loadPokemons$ = createEffect(
    () =>
     this.actions$.pipe(
      ofType(PokemonsActions.loadAllPokemons),
      tap(
        ()=> {
          this.store.pipe(
            select(arePokemonsLoaded),
            first()
          )
          .subscribe((pokemonsLoaded) => {
            if (!pokemonsLoaded) {
              this.pokemonService.getAll().pipe(
                first(),
              ).subscribe((pokemons: PokemonsPage[]) => {
               this.store.dispatch(allPokemonsLoaded({ pokemons }))
              })
            }
          })
        }
      )
    ),
    { dispatch: false}
  )

  loadNextPage$ = createEffect( ()=> {
    return this.actions$.pipe(
      ofType(PokemonsActions.loadNextPokemonPage),
      concatMap( (action)=> this.pokemonService.getWithQuery(action.offset)),
      map( (pokemons) => nextPageLoaded({pokemons}))
    )
  })

  constructor(
    private actions$: Actions,
    private pokemonService: PokemonService,
    private store: Store
  ) {}
}
