import { arePokemonsLoaded } from '../selectors/pokemons-page/pokemons.selector';
import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { filter, first, map, tap } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { AppState } from '../reducers/pokemons-page';
import { loadAllPokemons } from '../actions/pokemons-page/pokemons.actions';

@Injectable({ providedIn: 'root' })
export class PokemonsResolver implements Resolve<boolean> {
  constructor(private store: Store<AppState>) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.store.pipe(
      select(arePokemonsLoaded),
      tap((pokemonsLoaded) => {
        if (!pokemonsLoaded) {
          this.store.dispatch(loadAllPokemons())
        }
      }),
      filter((pokemonsLoaded) => pokemonsLoaded),
      first()
    );
  }
}
