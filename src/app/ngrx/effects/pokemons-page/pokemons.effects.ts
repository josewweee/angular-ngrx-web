import { allPokemonsLoaded, nextPageLoaded } from '../../actions/pokemons-page/pokemons.actions';
import { PokemonService } from '../../../services/pokemons.service';
import { map } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { PokemonsActions } from "../../actions/pokemons-page/action-types";
import { concatMap } from "rxjs/operators";

@Injectable()
export class PokemonsEffects {
  loadPokemons$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PokemonsActions.loadAllPokemons),
      concatMap((action) => this.pokemonService.getAll()),
      map((pokemons) => allPokemonsLoaded({ pokemons }))
    );
  });

  loadNextPage$ = createEffect( ()=> {
    return this.actions$.pipe(
      ofType(PokemonsActions.loadNextPokemonPage),
      concatMap( (action)=> this.pokemonService.getWithQuery(action.offset)),
      map( (pokemons) => nextPageLoaded({pokemons}))
    )
  })

  constructor(
    private actions$: Actions,
    private pokemonService: PokemonService
  ) {}
}
