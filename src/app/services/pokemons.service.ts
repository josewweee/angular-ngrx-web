import { Pokemon } from './../models/shared/pokemon';
import { Injectable } from "@angular/core";
import { PokemonsPage } from '../models/shared/pokemons-page';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';


@Injectable({ providedIn: 'root' })
export class PokemonService {
  constructor(private http: HttpClient) {
  }

  getAll(): Observable<PokemonsPage[]> {
    return this.http.get(environment.pokemonsBaseUrl).pipe(
      map((res) => res['results']),
      map((res: PokemonsPage[]) => {
        res.map((item: PokemonsPage) => {
          const lastSlashInUrl = item['url'].lastIndexOf('/');
          const lastLetterInUrl = item['url'].indexOf('n');
          const pokemonId = item['url'].slice(
            lastLetterInUrl + 2,
            lastSlashInUrl
          );
          item.id = parseInt(pokemonId);
          let photo = `${environment.pokemonImage}${pokemonId}.png`;
          item.photo = photo;
          if (
            item.name === 'bulbasaur' ||
            item.name === 'charmander' ||
            item.name === 'squirtle'
          ) {
            item.isFavorite = true;
          } else {
            item.isFavorite = false;
          }
        });
        return res;
      })
    );
  }

  getWithQuery(offset): Observable<PokemonsPage[]> {
    const pageUrl = `${environment.pokemonsBaseUrl}?limit=$20&offset=${offset}`
    return this.http
      .get(pageUrl)
      .pipe(
        tap((res) => console.log(res['results'])),
        map((res) => res['results']),
        map((res: PokemonsPage[]) => {
          res.map((item: PokemonsPage) => {
            const lastSlashInUrl = item['url'].lastIndexOf('/');
            const lastLetterInUrl = item['url'].indexOf('n');
            const pokemonId = item['url'].slice(
              lastLetterInUrl + 2,
              lastSlashInUrl
            );
            item.id = parseInt(pokemonId);
            let photo = `${environment.pokemonImage}${pokemonId}.png`;
            item.photo = photo;
          });
          return res;
        })
      );
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
