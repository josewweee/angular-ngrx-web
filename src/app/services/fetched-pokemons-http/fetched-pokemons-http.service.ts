import { Pokemon } from '../../models/shared/pokemon';
import { Injectable } from '@angular/core';
import { PokemonsPage } from '../../models/shared/pokemons-page';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FetchedPokemonsHttp {
  constructor(private http: HttpClient) {
  }

  private request(url: string) {
    return this.http.get(url);
  }

  getById(url: string): Observable<Pokemon> {
    return this.request(url).pipe(
      switchMap((response: Pokemon) => {
        return this.request(response.species.url).pipe(
          map((data) => {
            response.gender =
              data['gender_rate'] === -1
                ? 'genderless'
                : data['gender_rate'] > 4
                ? 'female'
                : 'male';
            response.flavor_text = data['flavor_text_entries'].find((item) => {
              if (item['language']['name'] === 'en') {
                return item['flavor_text'];
              }
            });
            return response;
          })
        );
      })
    );
  }
}
