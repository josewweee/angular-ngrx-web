import { Update } from '@ngrx/entity';
import { changeFavoriteStatus } from './../../../ngrx/actions/pokemons.actions';
import { addFavorite, removeFavorite } from './../../../ngrx/actions/favorite-pokemons/favorite-pokemons.actions';
import { selectAllFavoritePokemons } from './../../../ngrx/selectors/favorite-pokemons/favorite-pokemons.selector';
import { fetchingInProcess, selectAllFetchedPokemons } from './../../../ngrx/selectors/fetched-pokemons/pokemons.selector';
import { fetchPokemon } from './../../../ngrx/actions/fetched-pokemons/fetched-pokemons.actions';
import { selectAllPokemons } from './../../../ngrx/selectors/pokemons.selector';
import { PokemonsState } from './../../../ngrx/reducers/pokemons.reducer';
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
import { loadNextPokemonPage } from 'src/app/ngrx/actions/pokemons.actions';

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
    //this.ngOnDestroyActivated$ =  new Observable( (observer)=> observer.complete())
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

    this.favoriteSubscription = this.store.pipe(
      select(selectAllFavoritePokemons),
      map( (favorites) => {
        favoritesLength = favorites.length;

        if(favorites.some((item) => item.name === pokemon.name)) {
          removingFavorite = true;
        }
      }),
      take(1),
      tap(() => {
        console.log(removingFavorite);
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
    ).subscribe(noop, ()=> this.favoriteSubscription.unsubscribe())
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

  //REMOVER SUBSCRIPCIONES Y ELIMINAR PROMESA
  async searchForPokemonInStorage(pokemon: PokemonsPage): Promise<Pokemon> {
    let pokemonData: Pokemon;
    return new Promise( (resolve, reject) => {
      console.log(`buscando`);
      this.store.pipe(
        select(selectAllFetchedPokemons),
        map(pokemons => {
          let data = pokemons.find((item) => item.name === pokemon.name);
          pokemonData = data;

          resolve(pokemonData);
          console.log(pokemonData);
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

      this.store.pipe(
        select(fetchingInProcess),
        tap( fetchingInProcess => {
          if(fetchingInProcess === false)
          {
            this.store.pipe(
              select(selectAllFetchedPokemons),
              tap( pokemons => {
                fetchedPokemon = pokemons.find(item => item.name === pokemon.name)
                this.loader.stop();
                resolve(fetchedPokemon)
              })
            ).subscribe();
          }
        })
      ).subscribe();
    })
  }

  createDialog(component: ComponentType<any>, dialogConfig: MatDialogConfig) {
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
