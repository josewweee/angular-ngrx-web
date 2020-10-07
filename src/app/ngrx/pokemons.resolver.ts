import { PokemonEntityService } from './../services/pokemon-entity.service';
import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { filter, first, map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PokemonsResolver implements Resolve<boolean> {
  constructor(private pokemonsFetchService: PokemonEntityService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    console.log(`[resolver]`);

    return this.pokemonsFetchService.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.pokemonsFetchService.getAll();
        }
      }),
      filter((loaded) => !!loaded),
      first()
    );

    /* return this.pokemonsFetchService
      .getWithQuery({ limit: '20', id: '0' })
      .pipe(
        tap((data) => console.log(data)),
        map((pokemons) => !!pokemons)
      ); */

    /*  return this.pokemonsFetchService
      .getAll()
      .pipe(map((pokemons) => !!pokemons)); */
  }
}
