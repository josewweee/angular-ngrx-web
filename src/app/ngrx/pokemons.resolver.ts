import { PokemonEntityService } from './../services/pokemons-page/pokemon-entity.service';
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
    return this.pokemonsFetchService.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.pokemonsFetchService.getAll();
        }
      }),
      filter((loaded) => !!loaded),
      first()
    );
  }
}
