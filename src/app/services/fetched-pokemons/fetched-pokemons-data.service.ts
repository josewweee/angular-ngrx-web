import { Pokemon } from './../../models/pokemon';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data';
import { Observable } from 'rxjs';
import { map, tap, first } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class FetchedPokemonsDataService extends DefaultDataService<Pokemon> {
  constructor(http: HttpClient, httpUrlGenerator: HttpUrlGenerator) {
    super('Pokemons', http, httpUrlGenerator);
  }

  getById(url): Observable<Pokemon> {
    return this.http.get(url).pipe(map((res: Pokemon) => res));
  }
}
