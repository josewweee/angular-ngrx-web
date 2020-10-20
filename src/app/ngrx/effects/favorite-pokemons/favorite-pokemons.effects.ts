import { pokemonFetched } from '../../actions/fetched-pokemons/fetched-pokemons.actions';
import { PokemonService } from '../../../services/pokemons.service';
import { map } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { FetchedPokemonsActions } from "../../actions/fetched-pokemons/action-types";
import { concatMap } from "rxjs/operators";

@Injectable()
export class FavoritePokemonsEffects {

  /* fetchPokemon$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FetchedPokemonsActions.fetchPokemon),
      concatMap((action) => this.pokemonService.getById(action.pokemonUrl)),
      map((pokemon) => pokemonFetched({ pokemon }))
    );
  }); */

  constructor(
    private actions$: Actions,
    private pokemonService: PokemonService
  ) {}
}
