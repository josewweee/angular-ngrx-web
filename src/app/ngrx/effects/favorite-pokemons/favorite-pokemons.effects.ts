import { pokemonFetched } from '../../actions/fetched-pokemons/fetched-pokemons.actions';
import { PokemonService } from '../../../services/pokemons.service';
import { map } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { concatMap } from "rxjs/operators";

@Injectable()
export class FavoritePokemonsEffects {

  constructor(
    private actions$: Actions,
    private pokemonService: PokemonService
  ) {}
}
