import { Update } from '@ngrx/entity';
import { changeFavoriteStatus } from './../../../ngrx/actions/pokemons-page/pokemons.actions';
import { addFavorite, removeFavorite } from './../../../ngrx/actions/favorite-pokemons/favorite-pokemons.actions';
import { selectAllFavoritePokemons } from './../../../ngrx/selectors/favorite-pokemons/favorite-pokemons.selector';
import { fetchingInProcess, selectAllFetchedPokemons } from './../../../ngrx/selectors/fetched-pokemons/pokemons.selector';
import { fetchPokemon } from './../../../ngrx/actions/fetched-pokemons/fetched-pokemons.actions';
import { selectAllPokemons } from './../../../ngrx/selectors/pokemons-page/pokemons.selector';
import { PokemonsState } from '../../../ngrx/reducers/pokemons-page/pokemons.reducer';
import { SearchBarEventArgs } from '../../../models/nav-bar/search-bar-event-args';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { PokemonsPage } from '../../../models/shared/pokemons-page';
import { Pokemon } from '../../../models/shared/pokemon';
import { noop, Observable, Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter, first, map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { defaultDialogConfig } from '../../../shared/default-dialog-config';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SingleCardOverviewComponent } from '../single-card-overview/single-card-overview.component';
import { MultipleCardOverviewComponent } from '../multiple-card-overview/multiple-card-overview.component';
import { ComponentType } from '@angular/cdk/portal';
import { select, Store } from '@ngrx/store';
import { loadNextPokemonPage } from 'src/app/ngrx/actions/pokemons-page/pokemons.actions';

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

  fetchingToApiSubscription: Subscription;
  dialogSubscription: Subscription;

  ngOnDestroyActivated$: Observable<boolean>;

  constructor(
    private dialog: MatDialog,
    private loader: NgxUiLoaderService,
    private store: Store<PokemonsState>
  ) {}

  ngOnInit(): void {
    this.loadStoredPokemons();

    this.store.pipe(
      select(selectAllPokemons),
      tap( pokemons => this.pokemonApiOffset = pokemons.length + '')
    );
  }

  ngOnDestroy() {
    this.tryToUnsuscribe(this.fetchingToApiSubscription);
  }

  tryToUnsuscribe(variable: Subscription) {
    if (variable !== undefined) {
      variable.unsubscribe();
    }
  }

  loadStoredPokemons() {
    this.pokemonsPage$ = this.store.pipe(
      select(selectAllPokemons)
    );
  }

  filterPokemons(data: SearchBarEventArgs) {
    this.queryParams = data.newValue;
    if (this.queryParams !== '' && this.queryParams !== undefined) {
      this.pokemonsPage$ = this.store.pipe(
        select(selectAllPokemons),
        map((pokemons) =>
          pokemons.filter((item) => item.name.includes(this.queryParams))
        )
      );
    } else {
      this.loadStoredPokemons();
    }
  }

  addToFavorites(pokemon: PokemonsPage) {
    let favoritesLength: number;
    let removingFavorite: boolean = false;

    this.store.pipe(
      select(selectAllFavoritePokemons),
      map( (favorites) => {
        favoritesLength = favorites.length;

        if(favorites.some((item) => item.name === pokemon.name)) {
          removingFavorite = true;
        }
      }),
      first(),
      tap(() => {
        if (removingFavorite) {
          const newPokemon = { ...pokemon, isFavorite: false };
          const updatedPokemon: Update<PokemonsPage> = {
            id: pokemon.id,
            changes: newPokemon
          }
          const newActionRemovingFavorite = removeFavorite({pokemon: newPokemon})
          const newActionChangeFavoriteStatus = changeFavoriteStatus({update: updatedPokemon})
          this.store.dispatch(newActionRemovingFavorite);
          this.store.dispatch(newActionChangeFavoriteStatus);
        } else {
          if (favoritesLength !== undefined && favoritesLength >= 5) {
            console.warn(`Favorite Limit Reached`);
          } else {
            const newPokemon = { ...pokemon, isFavorite: true };
            const updatedPokemon: Update<PokemonsPage> = {
              id: pokemon.id,
              changes: newPokemon
            }
            const newActionAddingFavorite = addFavorite({pokemon: newPokemon})
            const newActionChangeFavoriteStatus = changeFavoriteStatus({update: updatedPokemon})
            this.store.dispatch(newActionAddingFavorite);
            this.store.dispatch(newActionChangeFavoriteStatus);
          }
        }
      })
    ).subscribe()
  }

  loadMorePokemons() {
    const newLoadPageAction = loadNextPokemonPage({ offset: this.pokemonApiOffset });
    this.store.dispatch(newLoadPageAction)
    let nextOffsetInt = parseInt(this.pokemonApiOffset) + 20;
    this.pokemonApiOffset = nextOffsetInt.toFixed(0);
  }

  async openPokemonDialog(pokemon: PokemonsPage) {
    const dialogConfig = defaultDialogConfig();
    let pokemonData: Pokemon = await this.searchForPokemonInStorage(pokemon)
    if (
      pokemonData === undefined ||
      pokemonData.name === undefined ||
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

  async searchForPokemonInStorage(pokemon: PokemonsPage): Promise<Pokemon> {
    let pokemonData: Pokemon;
    return new Promise( (resolve, reject) => {
      this.store.pipe(
        select(selectAllFetchedPokemons),
        first(),
        map(pokemons => {
          let data = pokemons.find((item) => item.name === pokemon.name);
          pokemonData = data;
          resolve(pokemonData);
        })
      ).subscribe()
    })
  }

  async fetchPokemon(pokemon: PokemonsPage): Promise<Pokemon> {
    return new Promise( (resolve, reject) => {
      let fetchedPokemon: Pokemon;
      this.loader.start();
      const newFetchPokemonAction = fetchPokemon({pokemonUrl: pokemon.url})
      this.store.dispatch(newFetchPokemonAction)

      this.fetchingToApiSubscription = this.store.pipe(
        select(fetchingInProcess),
        tap( fetchingInProcess => {
          if(fetchingInProcess === false)
          {
            this.store.pipe(
              select(selectAllFetchedPokemons),
              first(),
              tap( pokemons => {
                fetchedPokemon = pokemons.find(item => item.name === pokemon.name)
                this.loader.stop();
                resolve(fetchedPokemon)
              })
            ).subscribe();
          }
        }),
      ).subscribe();
    })
  }

  createDialog(component: ComponentType<any>, dialogConfig: MatDialogConfig) {
    this.dialogSubscription = this.dialog
    .open(component, dialogConfig)
    .afterClosed()
    .pipe(
      tap((data: Pokemon) => {
        if (data !== null) {
          this.pokemonBeforeComparing = data;
          this.isComparing = true;
        } else {
          this.isComparing = false;
        }
      }),
      first()
    )
    .subscribe();
  }
}
