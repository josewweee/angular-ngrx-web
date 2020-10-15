import { NgxUiLoaderService } from 'ngx-ui-loader';
import { PokemonsPage } from './../../models/pokemons-page';
import { Pokemon } from './../../models/pokemon';
import { FetchedPokemonsEntityService } from './../../services/fetched-pokemons/fetched-pokemons-entity.service';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { PokemonEntityService } from '../../services/pokemons-page/pokemon-entity.service';
import { map } from 'rxjs/operators';
import { defaultDialogConfig } from '../../shared/default-dialog-config';
import { MatDialog } from '@angular/material/dialog';
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
  pokemonsPage$: Observable<PokemonsPage[]>;
  isComparing: boolean = false;
  pokemonBeforeComparing: Pokemon;
  pokemonApiOffset: string = '20';
  queryParams: string = '';

  constructor(
    private pokemonsEntityService: PokemonEntityService,
    private dialog: MatDialog,
    private fetchedPokemonsEntityService: FetchedPokemonsEntityService,
    private favoriteEntityService: FavoriteEntityService,
    private loader: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.reload();

    this.pokemonsEntityService.entities$.forEach((item) => {
      this.pokemonApiOffset = item.length + '';
    });
  }

  reload() {
    if (this.queryParams !== '' && this.queryParams !== undefined) {
      this.pokemonsPage$ = this.pokemonsEntityService.entities$.pipe(
        map((pokemons) =>
          pokemons.filter((item) => item.name.includes(this.queryParams))
        )
      );
    } else {
      this.pokemonsPage$ = this.pokemonsEntityService.entities$.pipe(
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

    this.favoriteEntityService.entities$.subscribe((entities) => {
      favoritesLength = entities.length;

      if (entities.find((item) => item.name == pokemon.name)) {
        removingFavorite = true;
      }
    });
    if (removingFavorite) {
      const newPokemon = { ...pokemon, isFavorite: false };
      this.pokemonsEntityService.updateOneInCache(newPokemon);
      this.favoriteEntityService.removeOneFromCache(pokemon);
    } else {
      if (favoritesLength !== undefined && favoritesLength >= 5) {
        console.log(`ya no agregamos mas`);
      } else {
        const newPokemon = { ...pokemon, isFavorite: true };
        this.pokemonsEntityService.updateOneInCache(newPokemon);
        this.favoriteEntityService.addOneToCache(pokemon);
      }
    }
  }

  loadMorePokemons() {
    this.pokemonsEntityService.getWithQuery({
      limit: '20',
      id: this.pokemonApiOffset,
    });
    let nextOffsetInt = parseInt(this.pokemonApiOffset) + 20;
    this.pokemonApiOffset = nextOffsetInt + '';
  }

  async openPokemonDialog(pokemon) {
    const dialogConfig = defaultDialogConfig();

    let pokemonData: Pokemon = undefined;
    this.fetchedPokemonsEntityService.entities$.subscribe((entity) => {
      let data = entity.filter((item) => item.name === pokemon.name);
      pokemonData = data[0];
    });

    if (
      pokemonData === undefined ||
      pokemonData.name == undefined ||
      !pokemonData
    ) {
      this.loader.start();
      pokemonData = await this.fetchedPokemonsEntityService
        .getByKey(pokemon.url)
        .toPromise();
      this.loader.stop();
    }

    if (this.isComparing) {
      dialogConfig.data = {
        pokemon1: this.pokemonBeforeComparing,
        pokemon2: { ...pokemonData, photo: pokemon.photo },
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
        pokemonPageInfo: pokemon,
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
