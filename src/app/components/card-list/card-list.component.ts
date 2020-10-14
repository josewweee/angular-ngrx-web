import { PokemonsPage } from './../../models/pokemons-page';
import { Pokemon } from './../../models/pokemon';
import { FetchedPokemonsEntityService } from './../../services/fetched-pokemons/fetched-pokemons-entity.service';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { PokemonEntityService } from 'src/app/services/pokemon-entity.service';
import { filter, first, map, tap } from 'rxjs/operators';
import { defaultDialogConfig } from '../../shared/default-dialog-config';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SingleCardOverviewComponent } from '../single-card-overview/single-card-overview.component';
import { MultipleCardOverviewComponent } from '../multiple-card-overview/multiple-card-overview.component';
import { SearchBarEventArgs } from '../nav-bar/nav-bar.component';
import { FavoriteEntityService } from 'src/app/services/favorite-pokemons/favorite-entity.service';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss'],
})
export class CardListComponent implements OnInit {
  pokemonsName$: Observable<PokemonsPage[]>;
  isComparing: boolean = false;
  pokemonBeforeComparing: Pokemon;
  pokemonApiOffset: string = '20';
  queryParams: string = '';

  constructor(
    private pokemonsFetchService: PokemonEntityService,
    private dialog: MatDialog,
    private individualPokemonFetchService: FetchedPokemonsEntityService,
    private favoriteService: FavoriteEntityService
  ) {}

  ngOnInit(): void {
    this.reload();
    this.pokemonsFetchService.entities$.forEach((item) => {
      this.pokemonApiOffset = item.length + '';
    });
  }

  reload() {
    if (this.queryParams !== '' && this.queryParams !== undefined) {
      this.pokemonsName$ = this.pokemonsFetchService.entities$.pipe(
        map((pokemons) =>
          pokemons.filter((item) => item.name.includes(this.queryParams))
        )
      );
    } else {
      this.pokemonsName$ = this.pokemonsFetchService.entities$.pipe(
        map((pokemons) => pokemons)
      );
    }
  }

  filterData(data: SearchBarEventArgs) {
    this.queryParams = data.newValue;
    this.reload();
  }

  addToFavorites(pokemon: PokemonsPage) {
    let favoritesLength = undefined;
    let removingFavorite = false;

    this.favoriteService.entities$.subscribe((entities) => {
      favoritesLength = entities.length;
      if (entities.find((item) => item.name == pokemon.name)) {
        removingFavorite = true;
      }
    });

    if (removingFavorite) {
      const newPokemon = { ...pokemon, isFavorite: false };
      this.pokemonsFetchService.updateOneInCache(newPokemon);
      this.favoriteService.removeOneFromCache(pokemon);
    } else {
      if (favoritesLength !== undefined && favoritesLength >= 5) {
        console.log(`ya no agregamos mas`);
      } else {
        const newPokemon = { ...pokemon, isFavorite: true };
        this.pokemonsFetchService.updateOneInCache(newPokemon);
        this.favoriteService.addOneToCache(pokemon);
      }
    }
  }

  loadMorePokemons() {
    this.pokemonsFetchService.getWithQuery({
      limit: '20',
      id: this.pokemonApiOffset,
    });
    let nextOffsetInt = parseInt(this.pokemonApiOffset) + 20;
    this.pokemonApiOffset = nextOffsetInt + '';
  }

  async openPokemonModal(pokemon) {
    const dialogConfig = defaultDialogConfig();

    let pokemonData = undefined;
    this.individualPokemonFetchService.entities$.subscribe((entity) => {
      let data = entity.filter((item) => item.name === pokemon.name);
      pokemonData = data[0];
    });

    if (
      pokemonData === undefined ||
      pokemonData.name == undefined ||
      !pokemonData
    ) {
      pokemonData = await this.individualPokemonFetchService
        .getByKey(pokemon.url)
        .toPromise();
    }

    if (this.isComparing) {
      dialogConfig.data = {
        dialogTitle1: this.pokemonBeforeComparing.name,
        dialogTitle2: pokemonData.name,
        photo1: this.pokemonBeforeComparing.photo,
        photo2: pokemon.photo,
        pokemon1: this.pokemonBeforeComparing,
        pokemon2: pokemonData,
      };
      this.dialog
        .open(MultipleCardOverviewComponent, dialogConfig)
        .afterClosed()
        .subscribe((data: Pokemon) => {
          if (data !== null) {
            this.pokemonBeforeComparing = data;
            this.isComparing = true;
          } else {
            this.isComparing = false;
          }
        });
    } else {
      dialogConfig.data = {
        dialogTitle: pokemon.name,
        photo: pokemon.photo,
        pokemon: pokemonData,
      };

      this.dialog
        .open(SingleCardOverviewComponent, dialogConfig)
        .afterClosed()
        .subscribe((data: Pokemon) => {
          if (data !== null) {
            this.pokemonBeforeComparing = data;
            this.isComparing = true;
          } else {
            this.isComparing = false;
          }
        });
    }
  }
}
