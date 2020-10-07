import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { PokemonEntityService } from 'src/app/services/pokemon-entity.service';
import { map, tap } from 'rxjs/operators';
import { PokemonsPage } from 'src/app/models/pokemons-page';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss'],
})
export class CardListComponent implements OnInit {
  pokemonsName$: Observable<PokemonsPage[]>;

  constructor(private pokemonsFetchService: PokemonEntityService) {}

  ngOnInit(): void {
    this.reload();
  }

  reload() {
    console.log(this.pokemonsFetchService.entities$);

    this.pokemonsName$ = this.pokemonsFetchService.entities$.pipe(
      map((pokemons) => pokemons),
      tap((res) => console.log(res))
    );
  }
}
