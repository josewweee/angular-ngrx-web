import { SearchBarEventArgs } from '../../../models/nav-bar/search-bar-event-args';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { PokemonsPage } from '../../../models/shared/pokemons-page';
import { Pokemon } from '../../../models/shared/pokemon';
import { FetchedPokemonsEntityService } from '../../../services/fetched-pokemons/fetched-pokemons-entity.service';
import { Observable, Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { PokemonEntityService } from '../../../services/pokemons-page/pokemon-entity.service';
import { map, tap } from 'rxjs/operators';
import { defaultDialogConfig } from '../../../shared/default-dialog-config';
import { MatDialog } from '@angular/material/dialog';
import { SingleCardOverviewComponent } from '../single-card-overview/single-card-overview.component';
import { MultipleCardOverviewComponent } from '../multiple-card-overview/multiple-card-overview.component';
import { FavoriteEntityService } from 'src/app/services/favorite-pokemons/favorite-entity.service';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss'],
})
export class CardListComponent implements OnInit, OnDestroy {
  pokemonsPage$: Observable<PokemonsPage[]>;
  isComparing: boolean = false;
  pokemonBeforeComparing: Pokemon;
  pokemonApiOffset: string = '20';
  queryParams: string = '';

  favoriteSubscription: Subscription;
  fetchedPokemonsSubscription: Subscription;
  dialogSubscription: Subscription;

  constructor(
    private pokemonsEntityService: PokemonEntityService,
    private dialog: MatDialog,
    private fetchedPokemonsEntityService: FetchedPokemonsEntityService,
    private favoriteEntityService: FavoriteEntityService,
    private loader: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.loadStoredPokemons();

    this.pokemonsEntityService.entities$.pipe(
      tap((item) => {
        this.pokemonApiOffset = item.length + '';
      })
    );
  }

  ngOnDestroy() {
    this.tryToUnsuscribe(this.favoriteSubscription);
    this.tryToUnsuscribe(this.fetchedPokemonsSubscription);
    this.tryToUnsuscribe(this.dialogSubscription);
  }

  tryToUnsuscribe(variable: Subscription) {
    if (variable !== undefined) {
      variable.unsubscribe();
    }
  }

  loadStoredPokemons() {
    this.pokemonsPage$ = this.pokemonsEntityService.entities$.pipe(
      map((pokemons) => pokemons)
    );
  }

  filterPokemons(data: SearchBarEventArgs) {
    this.queryParams = data.newValue;
    if (this.queryParams !== '' && this.queryParams !== undefined) {
      this.pokemonsPage$ = this.pokemonsEntityService.entities$.pipe(
        map((pokemons) =>
          pokemons.filter((item) => item.name.includes(this.queryParams))
        )
      );
    } else {
      this.loadStoredPokemons();
    }
  }

  addToFavorites(pokemon: PokemonsPage) {
    let favoritesLength = undefined;
    let removingFavorite = false;

    this.favoriteSubscription = this.favoriteEntityService.entities$.subscribe(
      (entities) => {
        favoritesLength = entities.length;

        if (entities.some((item) => item.name == pokemon.name)) {
          removingFavorite = true;
        }
      }
    );
    if (removingFavorite) {
      const newPokemon = { ...pokemon, isFavorite: false };
      this.pokemonsEntityService.updateOneInCache(newPokemon);
      this.favoriteEntityService.removeOneFromCache(pokemon);
    } else {
      if (favoritesLength !== undefined && favoritesLength >= 5) {
        alert(`Favorite Limit Reached`);
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
    this.pokemonApiOffset = nextOffsetInt.toFixed(0);
  }

  async openPokemonDialog(pokemon) {
    const dialogConfig = defaultDialogConfig();

    let pokemonData: Pokemon;
    pokemonData = this.searchForPokemonInStorage(pokemon);

    if (
      pokemonData === undefined ||
      pokemonData.name == undefined ||
      !pokemonData
    ) {
      pokemonData = await this.fetchPokemon(pokemon);
    }

    if (this.isComparing) {
      dialogConfig.data = {
        pokemon1: this.pokemonBeforeComparing,
        pokemon2: { ...pokemonData, photo: pokemon.photo },
      };
      this.createDialog(MultipleCardOverviewComponent, dialogConfig);
    } else {
      dialogConfig.data = {
        pokemonPageInfo: pokemon,
        pokemon: pokemonData,
      };
      this.createDialog(SingleCardOverviewComponent, dialogConfig);
    }
  }

  searchForPokemonInStorage(pokemon: PokemonsPage): Pokemon {
    let pokemonData: Pokemon;
    this.fetchedPokemonsSubscription = this.fetchedPokemonsEntityService.entities$.subscribe(
      (entity) => {
        let data = entity.filter((item) => item.name === pokemon.name);
        pokemonData = data[0];
      }
    );
    return pokemonData;
  }

  async fetchPokemon(pokemon: PokemonsPage) {
    let fetchedPokemon: Pokemon;
    this.loader.start();
    fetchedPokemon = await this.fetchedPokemonsEntityService
      .getByKey(pokemon.url)
      .toPromise();
    this.loader.stop();
    return fetchedPokemon;
  }

  createDialog(component, dialogConfig) {
    this.dialogSubscription = this.dialog
      .open(component, dialogConfig)
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
// SingleCardOverviewComponent
